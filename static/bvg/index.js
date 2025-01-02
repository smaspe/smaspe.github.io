document.addEventListener("alpine:init", () => {
  Alpine.store("nextStops", {
    stationId: "",
    selectedLines: [],
    stationName: "",
    lines: [],
    schedule: [],
    isLoading: false,
    error: "",

    async getSchedule(event) {
      event.preventDefault();
      this.isLoading = true;
      this.schedule = [];
      this.error = "";

      try {
        const response = await fetch(
          `https://v6.bvg.transport.rest/stops/${this.stationId}/departures`
        );
        const data = await response.json();

        this.schedule = data.departures.map((departure) => ({
          line: departure.line.name,
          direction: departure.direction,
          departure: departure.when ?? departure.plannedWhen,
        }));
        this.stationName = data.departures[0].stop.name;

        // Get sorted unique lines
        this.lines = [
          ...new Set(this.schedule.map((stop) => stop.line)),
        ].sort();
      } catch (err) {
        this.error = "Failed to fetch schedule";
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    filteredSchedule() {
      return this.schedule.filter(
        (d) =>
          this.selectedLines.length === 0 || this.selectedLines.includes(d.line)
      );
    },

    init() {
      const updateFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        this.stationId = urlParams.get("stationId") ?? "";
        this.selectedLines = urlParams.getAll("selectedLines");
      };
      updateFromUrl();

      window.addEventListener("popstate", () => {
        updateFromUrl();
      });

      this.$watch("stationId", (value) => {
        const url = new URL(window.location.href);
        url.searchParams.set("stationId", value);
        history.pushState({}, document.title, url.toString());
      });
      this.$watch("selectedLines", (value) => {
        const url = new URL(window.location.href);
        url.searchParams.delete("selectedLines");
        value.forEach((v) => url.searchParams.append("selectedLines", v));
        history.pushState({}, document.title, url.toString());
      });
    },
  });
});
