patch-jest-cache
---
patches jest caching to work around an issue outstanding since 2017

- make caching opportunistic: if it works, great, if it fails, c'est la vie!
  - caching should be to improve performance, _not_ a lynchpin
- facilitate complete disable of read and/or write cache
  - because jest writes out cache files even when invoked with `--no-cache`,
    wasting time on I/O for files that won't be used
    
usage
---

```
npx patch-jest-cache {options}
```

- default behavior patches cache reading and writing to only warn on error
- specify `--no-warn-on-errors` to suppress warning messages
- specify `--disable-read-cache` or `--disable-write-cache` to completely
  disable cache read / write
