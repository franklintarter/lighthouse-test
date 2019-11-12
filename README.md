# Lighthouse Testing

> A simple CLI tool for automated lighthouse testing.

## Setup

Intstall

```shell
yarn add lighthouse-test
```

Run

```shell
lighthouse-test https://google.com 50
# First param is the URL to test
# Second param is the minimum score required to pass the test
```

### Use In Project

package.json

```json
{
  // ...
  "scripts": {
    "lighthouse": "lighthouse-test http://localhost:9000 90"
  }
  // ..
}
```

## Future Improvements

- Use a config file, or config settings in package.json
- Multiple URLS
- Turn off certain tests, i.e. ignore PWA score

### Inspiration

Code & concepts inspired by this [article](https://dev.to/rishikc/automate-lighthouse-audits-for-your-progressive-web-application-3lfc).
