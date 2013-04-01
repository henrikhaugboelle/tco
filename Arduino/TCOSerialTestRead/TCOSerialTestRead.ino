#include <TCOSerial.h>

TCOSerial tcoSerial;

void setup(){
  tcoSerial.begin();
}

void loop(){
  if(tcoSerial.readSerial()){
    // set global state
    int i = 0;
    while (i < tcoSerial.readIndex){ // TODO: Write logic for signals
      Serial.write(tcoSerial.readQueue[i++]);
    }
    tcoSerial.resetRead();
  }
}
  
