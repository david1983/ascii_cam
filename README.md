# ascii_cam
A webapp that create an ASCII picture using your webcam.

##Proof of concept
The application takes a video stream using the getUserMedia API and then convert the stream into an array of pixels.
For each pixel of the array we retrieve a grey value that can be converted in an ASCII character.

