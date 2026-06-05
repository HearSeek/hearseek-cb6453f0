Single surgical change in `src/lib/hearseek.ts` (line 285):

```
- const body: Record<string, unknown> = { texts: query };
+ const body: Record<string, unknown> = { query };
```

No other call sites use `texts`. Nothing else touched.