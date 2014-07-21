vegnetCrawler
=============

This crawler use cURL to download pages from vegnet.com.cn, use nodeJS to parse file and manage download processes.

The goal of the progress

Tasks are specifies by config files, each config file specifies a single page download task.
The config files are put in 4 directories below:

- origin: newTask.js puts the config files here

- working: when start a download task, its config file will move to here

- error: a failed task's config file will be found here, wait for next executing

- success: when download complete and has no parse error, its config file will be found here

Other directories:
- parsed: after downloaded and parsed, the result file will be here

File naming rule:
Every task has an id, its curl config file name is id.curl, parsed file name is id.txt


