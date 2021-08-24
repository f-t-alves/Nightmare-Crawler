# NodeJS-Crawler

Made specifically for scraping and crawling Hiring Coder's playlists.

## Install

```
npm install
```

Rename `.sample.env` to just `.env` and set your credentials in it.

## Running

Change `PLAYLIST_URL` in line 10 to whatever your target playlist's URL is.

```
npm run start
```

## Results

In the `results` folder, several screenshots of the steps will be saved, as well as `links.json`, the file with all the video links from the playlist. 
Disclaimer: The very first video might be repeated as both video 00 and 01.