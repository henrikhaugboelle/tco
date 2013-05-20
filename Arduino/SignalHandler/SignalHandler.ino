#include <TouchSensor.h>
#include <IOPlatform.h>

// Size of the input buffer
const int inputBuffer = 4;
// Size of the outpur buffer
const int outputBuffer = 4;
// The expected size of an incomming message
const int expectedInCommingMessageSize = 4;
// The factor for which we register the kapacitance as 'touched'
const long touchFactor = 300;
// The timeout value of the touch function ~ 64ms on the Atmega 328
const int touchTimeout = 20000;

// Pin numbers for components
const int led2GroundPin = 2;
const int led1RedPin = 3;
const int led1GroundPin = 4;
const int led1GreenPin = 5;
const int led1BluePin = 6;
const int touchReceivePin = 7;
const int touchSendPin = 8;
const int led2RedPin = 9;
const int led2GreenPin = 10;
const int led2BluePin = 11;
const int vibratorPin = 12;
const int vibratorGroundPin = 13;
const int xPin = A1;
const int yPin = A2;
const int zPin = A3;

// The platform used for communication with the docking station
IOPlatform platform;
// Initialisation of the touch sensor
TouchSensor touchSensor = TouchSensor(touchSendPin, touchReceivePin, touchTimeout);

// The least kapacitance measured
long leastTouchValue = 20000;
// The last value of x from the accelerometer
byte lastX = 0;
// The last value of y from the accelerometer
byte lastY = 0;
// The last value of z from the accelerometer
byte lastZ = 0;

void setup(){
  // Set the pins in the correct mode
  pinMode(led1RedPin, OUTPUT);
  pinMode(led1GroundPin, OUTPUT);
  pinMode(led1GreenPin, OUTPUT);
  pinMode(led1BluePin, OUTPUT);
  pinMode(led2RedPin, OUTPUT);
  pinMode(led2GroundPin, OUTPUT);
  pinMode(led2GreenPin, OUTPUT);
  pinMode(led2BluePin, OUTPUT);
  pinMode(vibratorPin, OUTPUT);
  pinMode(vibratorGroundPin, OUTPUT);
  
  // Set the pins used for ground
  digitalWrite(vibratorGroundPin, LOW); 
  digitalWrite(led1GroundPin, LOW);
  digitalWrite(led2GroundPin, LOW);
  
  // Register the callback for handling of sedning values to the server
  platform.setSendValues(&sendValues);
  // Register the callbakc for handling of receiving values from the server
  platform.setSetState(&setState);
  // Begin to listen for messages from the server
  platform.begin(inputBuffer, outputBuffer);
}

void loop(){
}

// The method used for sending values to the server
int sendValues(byte *queue, int bufferSize){
    byte i = 0;
    
    // Read the accelerometer
    byte x = analogRead(xPin) / 4;
    byte y = analogRead(yPin) / 4;
    byte z = analogRead(zPin) / 4;
    
    // Read the touch value 30 times, and return the average value
    int touchValue = touchSensor.read(30);
    // Test if this value was the lowest measured
    if(touchValue < leastTouchValue){
      leastTouchValue = touchValue;
    }
    
    // Build the message
    queue[i++] = abs(x - lastX);
    queue[i++] = abs(y - lastY);
    queue[i++] = abs(z - lastZ);
    queue[i++] = (touchValue - leastTouchValue > touchFactor) ? 255 : 0;
    
    // Store the values from the accelerometer
    lastX = x;
    lastY = y;
    lastZ = z;
    
    // Return the length of the message
    return i;
}

// The method used for receiving values from the server
void setState(byte *queue, int length){
    byte i = 0;
    
    // Test if the message has the expected length
    if(length == expectedInCommingMessageSize)
    {
      // Read the values from the message
      byte red = queue[i++];
      byte green = queue[i++];
      byte blue = queue[i++];
      byte vibration = queue[i++];
      
      // Set the outputs
      analogWrite(led1RedPin, red);
      analogWrite(led1GreenPin, green);
      analogWrite(led1BluePin, blue);
      analogWrite(led2RedPin, red);
      analogWrite(led2GreenPin, green);
      analogWrite(led2BluePin, blue);
      analogWrite(vibratorPin, vibration);
    }
}



