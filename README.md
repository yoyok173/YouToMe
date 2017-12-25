YouToMe is an application that I created in ReactJS that will display an HTML form that can be used to download the audio from a YouTube URL as an mp3, write the ID3 tags and move the file to a location that you specify.

Requirements to run YouToMe:
1. Linux based server (tested with Apache and Nginx) or Windows based server (tested with Apache).
2. Open source utility youtube-dl (https://rg3.github.io/youtube-dl/) which does NOT need root permissions. If you are using Linux, it should be available in your repo so you can do apt-get install youtube-dl. A Windows binary is also available. If you ever get an error in the first step when the song is downloading, make sure to update youtube-dl since it may stop working until you update it to the latest version and also make sure the php folder is writable by the user that your web server runs as with 777 permissions.
3. getid3 for php (http://getid3.sourceforge.net/) and ffpmeg (https://ffmpeg.org/). 
4. Access to a location where you want the audio file to be copied to.

When you submit the page, youtube-dl (which does NOT need root permissions) will create an MP3 based on the audio embedded inside of the video. 

After it has completed, the ID3 tags will be written based on the information provided in the form.

Finally, it will be moved to the location specified in php/serverTasks.php. Change the destinationPath variable in this file accordingly to point to the location where you want to copy the audio file. The folder will need to be writable by the user that the web server runs as.

Build instruction:
Prerequisites: Install these applications if they are not installed already: Node.js, npm

1. Rename package.json.sample to package.json
2. Edit the "homepage" line in package.json and add the URL of your site so it reads "homepage":"https://www.mysite.com/you2me",
3. edit src/php/serverTasks.php and edit the $destinationPath to point to the path where you want the files to be copied to
4. npm install - This should install all of the missing dependencies since I don't include node_modules directory
5. npm run build
6. If everything compiled correctly, copy the contents of the build folder to the folder on your web server where you are hosting it and you referred to in step 2 (E.G. /you2me)
7. Copy the php folder to the build folder.
8. On Windows, make sure you have the following files/folders in build/php: getid3 folder (Extract latest getid3.zip and copy getid3 subfolder), youtube-dl.exe and ffmpeg.exe and ffprobe.exe from the latest ffmpeg zip file.

YoutoMe also supports a URL parameter with the YouTube link. The easiest way to do this is to create a bookmark in your browsers' toolbar with the name Send to YouToMe and the following JavaScript code as the URL of the bookmark:

javascript:if(window.location.toString().indexOf('https://www.youtube.com')!=-1){window.open('https://mysite.com/YouToMe/?URL='+window.location.toString()+'&Title='+document.title,'_parent','');event.preventDefault();}

Don't forget to replace mysite.com/YouToMe with the full URL of your instance of YouToMe. Now visit a YouTube video and click on the bookmark. A new tab/window will open with YouToMe with the URL already filled in. YouToMe will also get the title of the YouTube video page and try to determine the artist and song name. 

Please contact me if you have any questons, run into any problems or would like to suggest new features. 
