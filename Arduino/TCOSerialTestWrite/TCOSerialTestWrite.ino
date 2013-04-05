#include <TCOSerial.h>

TCOSerial tcoSerial;
byte writeQueue[8]; // Remember to change if test needs more characters
  
void setup(){
  tcoSerial.begin();
}

void loop(){
  byte i = 0;
  while(Serial.available() > 0)
  {
    byte input = Serial.read();
    writeQueue[i++] = input;
    delay(100);
  }
  
  if(i != 0){
      tcoSerial.writeSerial(writeQueue, i);
  }
}
  
