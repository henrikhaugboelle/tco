#include <CapacitiveSensor.h>
#include <TCOPlatform.h>

const int inputBuffer = 4;
const int outputBuffer = 4;
const long leastTouchValue = 20000;
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

TCOPlatform tcoPlatform;
CapacitiveSensor touchSensor = CapacitiveSensor(touchSendPin,touchReceivePin);

byte lastX = 0;
byte lastY = 0;
byte lastZ = 0;


void setup(){
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
  tcoPlatform.setSendValues(&sendValues);
  tcoPlatform.setSetState(&setState);
  tcoPlatform.begin(inputBuffer, outputBuffer);
}

void loop(){
}

int sendValues(byte *queue, int length){
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
    queue[i++] = abs(x - lastX);
    queue[i++] = abs(y - lastY);
    queue[i++] = abs(z - lastZ);
    queue[i++] = touch;
    lastX = x;
    lastY = y;
    lastZ = z;
    return i;
}

void setState(byte *queue, int length){
    byte i = 0;
    if(length == expectedInCommingMessageSize)
    {
      byte red = queue[i++];
      byte green = queue[i++];
      byte blue = queue[i++];
      byte vibration = queue[i++];
      analogWrite(ledRedPin1, red);
      analogWrite(ledGreenPin1, green);
      analogWrite(ledBluePin1, blue);
      analogWrite(ledRedPin2, red);
      analogWrite(ledGreenPin2, green);
      analogWrite(ledBluePin2, blue);
      analogWrite(vibrator, vibration);
    }
}



