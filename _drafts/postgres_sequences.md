Sequences don't care about transactions. That can be tricky.

Example:
- Start a transaction
- Insert a new row
- Rollback
- Insert a new row
  - Sequence skipped a value!
 
- Check with `SERIAL`
 
Use `GENERATED ALWAYS AS IDENTITY`
