#include <TCOPlatform.h>

TCOPlatform tcoPlatform;
byte lastX = 0;
byte lastY = 0;
byte lastZ = 0;

void setup(){
  tcoPlatform.setSendValues(&sendValues);   // Method for handling output
  tcoPlatform.setSetState(&setState);       // Method for handling input
  tcoPlatform.begin(4, 4);                  // Start the platform, input and output buffer size = 4
}

void loop(){
}

int sendValues(byte *queue, int length){
    byte i = 0;
    queue[i++] = lastX;
    queue[i++] = lastY;
    queue[i++] = lastZ;
    return 3;
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



