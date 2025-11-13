Basically, in most cases, `reduce` is not the right tool

Why?
Because it's not expressive. You need to read the function to understand what it's doing

Examples?
- sum
- min/max
- 
```js
 const earliest = values.reduce(
          (acc, v) => v.date < acc ? value.date : acc,
          values[0].date
        );
```

instead use:
```js
const earliest = Math.min(values.map(v => v.date))
```

- filtering an array
- flatting an array
