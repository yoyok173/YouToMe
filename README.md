YouToMe is an application that I created in ReactJS that will display an HTML formi that can be used to download the audio from a YouTube URL, write the ID3 tags and move the file to a location that you specify..

Requirements to run YouToMe:
1. Linux based server (tested with Apache and Nginx) or Windows based server (currently untested but should work).
2. Terminal utility youtube-dl (https://rg3.github.io/youtube-dl/)i which does NOT need root permissions. Iit should be available in your repo so you can do apt-get install youtube-dl .
3. Access to a location where you want the audio file to be copied to.

When you submit the page, youtube-dl (which does NOT need root permissions) will create an MP3 based on the audio embedded inside of the video. 

After it has completed, the ID3 tags will be written based on the information provided in the form.

Finally, it will be moved to the location specified in php/serverTasks.php. Change the destinationPath variable accordingly to point to the location where you want to copy the audio file. The folder will need to be writable by
the user that the web server runs as.

Build instruction:
Prerequisites: Install these applications if they are not installed alread: Node.js, npm

1. npm install
2. npm run build
3. If everything comppiled correctly, copy the contents of the build fold to a folder on your web server

Please contact me if you have any questons, run into any problems or would like to suggest new features. 
