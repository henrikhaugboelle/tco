#include <IOPlatform.h>

IOPlatform platform;
byte lastX = 0;
byte lastY = 0;
byte lastZ = 0;

void setup(){
  platform.setSendValues(&sendValues);   // Method for handling output
  platform.setSetState(&setState);       // Method for handling input
  platform.begin(4, 4);                  // Start the platform, input and output buffer size = 4
}

void loop(){
}

int sendValues(byte *queue, int bufferSize){
    byte i = 0;
    queue[i++] = lastX;
    queue[i++] = lastY;
    queue[i++] = lastZ;
    return 4;
}

void setState(byte *queue, int length){
    byte i = 0;
    if(length == 4)
    {
      lastX = queue[i++];
      lastY = queue[i++];
      lastZ = queue[i++];
    }
}



