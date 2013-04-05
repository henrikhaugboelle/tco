#include <QueueList.h>
#include <TCOSerial.h>

byte writeQueue[8];
TCOSerial tcoSerial;
int waitReadTouch;
const int readTouchFactor = 100;
const int waitSend = 100;
const int touchSensibility = 25390; // readTouchFactor * 235,9
int timer = 0;
int counter = 0;
const int groundPin = 8;
const int powerPin = 9;
const int touchPin = A0;
const int xPin = A1;
const int yPin = A2;
const int zPin = A3;
byte lastX = 0;
byte lastY = 0;
byte lastZ = 0;
const int ledPin = 10;
const int builtInLedPin = 11;
const int ground = 12;
const int expectedInCommingMessageSize = 2;

void setup(){
  tcoSerial.begin();
  pinMode(groundPin, OUTPUT);
  pinMode(powerPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(builtInLedPin, OUTPUT);
  pinMode(ground, OUTPUT);
  digitalWrite(ground, LOW); 
  digitalWrite(groundPin, LOW); 
  digitalWrite(powerPin, HIGH);
  waitReadTouch = waitSend / readTouchFactor;
}

void loop(){
  if(tcoSerial.readSerial()){
    // set global state
    byte i = 0;
    if(tcoSerial.inCommingMessageSize == expectedInCommingMessageSize)
    {
      analogWrite(ledPin, tcoSerial.readQueue[i++]);
      analogWrite(builtInLedPin, tcoSerial.readQueue[i++]);
    }
    tcoSerial.resetRead();
  }
  if(timer > waitSend){
    byte x = analogRead(xPin) / 4;
    byte y = analogRead(yPin) / 4;
    byte z = analogRead(zPin) / 4;
    byte touch = 0;
    if(counter > touchSensibility)
    {
      touch = 0;
    }
    else
    {
      touch = 255;;
    }
    byte i = 0;
    writeQueue[i++] = abs(x - lastX);
    writeQueue[i++] = abs(y - lastY);
    writeQueue[i++] = abs(z - lastZ);
    writeQueue[i++] = touch;
    tcoSerial.writeSerial(writeQueue, i);
    lastX = x;
    lastY = y;
    lastZ = z;
    timer = 0;
    counter = 0;
  }
  // Read sensor values 100 times before sending
  if(timer % waitReadTouch == 0)
  {
    counter += analogRead(touchPin) / 4;
  }
  timer++;
}


