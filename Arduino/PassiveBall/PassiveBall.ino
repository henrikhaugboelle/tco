#include <QueueList.h>
#include <TCOSerial.h>

byte writeQueue[8];
TCOSerial tcoSerial;
int timer = 0;
int counter = 0;
const int groundPin = 8;
const int powerPin = 9;
const int xPin = A1;
const int yPin = A2;
const int zPin = A3;
const int ledPin = 10;

void setup(){
  tcoSerial.begin();
  pinMode(groundPin, OUTPUT);
  pinMode(powerPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(groundPin, LOW); 
  digitalWrite(powerPin, HIGH);
}

void loop(){
  if(tcoSerial.readSerial()){
    // set global state
    byte i = 0;
    while (i < tcoSerial.readIndex){ // We need logic for how many signals we are receiving and what happens if they are all not there
      analogWrite(ledPin, tcoSerial.readQueue[i]);
      i++;
    }
    tcoSerial.resetRead();
  }
  //if(timer > 10000){ original value
  if(timer > 100){
    byte x = 0;
    //byte y = analogRead(yPin) / 4;
    //byte z = analogRead(zPin) / 4;
    if(counter > 25390)
    {
      x = 0;
    }
    else
    {
      x = 255;;
    }
    byte i = 0;
    //writeQueue[i++] = x;
    //writeQueue[i++] = y;
    //writeQueue[i++] = z;
    //tcoSerial.writeSerial(writeQueue, i);
    timer = 0;
    counter = 0;
  }
  // Read sensor values 100 times before sending
  //if(timer % 200 == 0)
  //{
  //  counter += analogRead(xPin) / 4;
  //}
  timer++;
}


