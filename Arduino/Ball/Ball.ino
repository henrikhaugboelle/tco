#include <CapacitiveSensor.h>
#include <QueueList.h>
#include <TCOSerial.h>

byte writeQueue[8];
TCOSerial tcoSerial;
const int waitSend = 100;
int timer = 0;
int counter = 0;
byte lastX = 0;
byte lastY = 0;
byte lastZ = 0;
long leastTouchValue = 20000; // initialized to the max touch value
const int expectedInCommingMessageSize = 4;
const long touchFactor = 300;

const int ledGroundPin2 = 2;
const int ledRedPin1 = 3;
const int ledGroundPin1 = 4;
const int ledGreenPin1 = 5;
const int ledBluePin1 = 6;
const int touchReceivePin = 7;
const int touchSendPin = 8;
const int ledRedPin2 = 9;
const int ledGreenPin2 = 10;
const int ledBluePin2 = 11;
const int vibrator = 12;
const int vibratorGround = 13;
const int xPin = A1;
const int yPin = A2;
const int zPin = A3;

CapacitiveSensor   touchSensor = CapacitiveSensor(touchSendPin,touchReceivePin);        // 10 megohm resistor between pins 4 & 2, pin 2 is sensor pin, add wire, foil

void setup(){
  tcoSerial.begin();
  pinMode(ledRedPin1, OUTPUT);
  pinMode(ledGroundPin1, OUTPUT);
  pinMode(ledGreenPin1, OUTPUT);
  pinMode(ledBluePin1, OUTPUT);
  pinMode(ledRedPin2, OUTPUT);
  pinMode(ledGroundPin2, OUTPUT);
  pinMode(ledGreenPin2, OUTPUT);
  pinMode(ledBluePin2, OUTPUT);
  pinMode(vibrator, OUTPUT);
  pinMode(vibratorGround, OUTPUT);
  digitalWrite(vibratorGround, LOW); 
  digitalWrite(ledGroundPin1, LOW);
  digitalWrite(ledGroundPin2, LOW);
}

void loop(){
  if(tcoSerial.readSerial()){
    // set global state
    byte i = 0;
    if(tcoSerial.inCommingMessageSize() == expectedInCommingMessageSize)
    {
      byte red = tcoSerial.readQueue[i++];
      byte green = tcoSerial.readQueue[i++];
      byte blue = tcoSerial.readQueue[i++];
      byte vibration = tcoSerial.readQueue[i++];
      analogWrite(ledRedPin1, red);
      analogWrite(ledGreenPin1, green);
      analogWrite(ledBluePin1, blue);
      analogWrite(ledRedPin2, red);
      analogWrite(ledGreenPin2, green);
      analogWrite(ledBluePin2, blue);
      analogWrite(vibrator, vibration);
    }
  }
  
  if(timer > waitSend){
    byte x = analogRead(xPin) / 4;
    byte y = analogRead(yPin) / 4;
    byte z = analogRead(zPin) / 4;
    int touchValue = touchSensor.capacitiveSensorRaw(30);
    if(touchValue < leastTouchValue){
      leastTouchValue = touchValue;
    }
    byte touch = 0;
    if(touchValue - leastTouchValue > touchFactor)
    {
      touch = 255;
    }
    else
    {
      touch = 0;;
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
  timer++;
}


