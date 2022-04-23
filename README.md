# CasperMetricsFront

This project is a front UI for https://caspermetrics.io
It serves various metrics for Casper blockchain and provides an API interface to fetch the data.

Initial approach of this work is to calculate CSPR circulating supply. Although some parts of the supply are distributed on protocol level, there is a significant amount of transactions which are processed manually. We've decided to bring such transactions flow to atomic level of transparency, as we believe this is an important component for the blockchain where decentralization and transparency are playing fundamental role in the architecture. Manual funds distribution make calculation process very difficult, as transactions are passing between many inputs; these inputs are unknown and distribution flow can be very confusing for an outside observer. We made a lot of research on this subject and came up with the provided solution.

This engine was built specifically for circulating supply calculation, however not limited and can become a foundation of new tools, for example, collecting and plotting employees salaries, donations and all sort of transactions flows for unlimited needs. The crawler builds a dependency tree connecting HEX addresses with accounts hashes. Users will be able to see connections between different inputs and represent this in a form of diagrams. Crawler is able to collect data very fast and provides user with a populated database for the future network analysis.

## Prerequisites

Make sure you use node 16+

## Installation and running

Run
```sh
npm install
```

To serve locally, run:

```sh
ng serve 
```

For building run:

```shell
npm run build
```

You can use prod mode for deploying it for production use.

## Other notes and API connection

Please see https://github.com/a3mc/Casper-Metrics repository of the main app for more details.

## Documentation

Most of the code is self-explanatory.
And we are preparing a full documentation that will be released as a part of Milestone 3 of the project.

## Contributing and Code of Conduct

You are welcome to add your suggestions and to contribute to the project.
Please create PRs against develop branch if you want to contribute.
*We reserve the right to ignore or decline any PRs and not to respond to the messages.*

Please follow the best practices, follow the code structure and make sure that your suggestion is really valuable for the project and well-formed.
When you open an issue, please make sure you provide enough details on how to reproduce it.
Don't use explicit lexis and be polite to other members.

## License

This project is licensed under [MIT license](https://github.com/a3mc/Casper-Metrics-Front/blob/master/license.txt).


