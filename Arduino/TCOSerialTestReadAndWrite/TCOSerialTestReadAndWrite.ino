#include <TCOSerial.h>

TCOSerial tcoSerial;
byte writeQueue[8]; // Remember to change if test needs more characters
  
void setup(){
  tcoSerial.begin();
}

void loop(){
  if(tcoSerial.readSerial()){
    // set global state
    byte i = 0;
    while (i < tcoSerial.readIndex){
      writeQueue[i] = tcoSerial.readQueue[i] + 1;
      i++;
    }
    tcoSerial.resetRead();
    tcoSerial.writeSerial(writeQueue, i);
  }
}
  
