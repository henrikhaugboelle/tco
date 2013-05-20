/*
 *  SerialFraming.h
 */

#ifndef _SerialFraming_H
#define _SerialFraming_H

#include <Arduino.h>

// This class handles framming of messages for serial communication
class SerialFraming {
  public:
    SerialFraming();
    void begin(int bufferSize);
	byte* readFrame();
    void writeFrame(byte *writeQueue, byte size);
	byte inCommingMessageSize();
  private:
	// The size of the input buffer
    int bufferSize;
	// The input queue
	byte *readQueue;
	// The current size of the message in the input queue 
    byte messageSize;
	// Tells if the previous character was an escape character
    boolean nextEscaped;
	// Tells if the previous character was a boundary character
	boolean newMessage;
	// The value of the escape character
    byte ESCAPE;
	// The value of the boundary character
    byte BOUNDARY;
	// The value of the inverted escape character
    byte ESCAPEINV;
	// The value of the inverted boundary character
    byte BOUNDARYINV;
};

// Constructor
SerialFraming::SerialFraming() {
}

// This method makes the class listen for new messages
void SerialFraming::begin(int _bufferSize) {
    bufferSize = _bufferSize + 1;
    Serial.begin(9600);
	readQueue = (byte *)malloc(bufferSize * sizeof(int));
    messageSize = 0;
	nextEscaped = false;
	newMessage = true;
    ESCAPE = 125;
    BOUNDARY = 126;
    ESCAPEINV = 93;
    BOUNDARYINV = 94;
}

// This method reads all the characters in the input buffer
// If a boundary character is found, the message is returned
byte *SerialFraming::readFrame(){
  // If the previous character was a boundary character
  if(newMessage){
    messageSize = 0;
	nextEscaped = false;
	newMessage = false;
  }
  
  // Tests for characters in the buffer
  while(Serial.available() > 0)
  {
	// If the buffer is full, empty the buffer
	if(messageSize == bufferSize){
		messageSize = 0;
		nextEscaped = false;
	}
	
	// Read the next character
	byte input = Serial.read();
	// Test if the character is escaped
	if (nextEscaped){
      if(input == ESCAPEINV){
        readQueue[messageSize++] = ESCAPE;
      }
      else if(input == BOUNDARYINV){
        readQueue[messageSize++] = BOUNDARY;
      }
      nextEscaped = false;
    }
	// Test if the character is the escape character
    else if(input == ESCAPE){
      nextEscaped = true;
    }
	// Test if the character is the boundary character
    else if(input == BOUNDARY){
	  newMessage = true;
	  return readQueue;
    }
	// Put the character in the message queue
    else{
      readQueue[messageSize++] = input;
    }
  }
  return NULL;
}

// This method sends a message using asynchonous framing
void SerialFraming::writeFrame(byte *writeQueue, byte size){
  byte i = 0;
  // While there are characters to send
  while (i < size){
    byte character = writeQueue[i++];
	// If the character is the escape character, invert it
    if(character == ESCAPE){
      Serial.write(ESCAPE);
      Serial.write(ESCAPEINV);
    }
	// If the character is the boundary character, invert it
    else if(character == BOUNDARY){
      Serial.write(ESCAPE);
      Serial.write(BOUNDARYINV);
    }
	// Else write the character
    else{
      Serial.write(character);
    }
  }
  
  // In the end of a message, write a boundary character
  Serial.write(BOUNDARY);
}

// The size of the message
byte SerialFraming::inCommingMessageSize(){
  return messageSize;
}
#endif
