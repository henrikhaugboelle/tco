/*
 *  TCOSerial.h
 */

#ifndef _TCOSerial_H
#define _TCOSerial_H

#include <Arduino.h>

class TCOSerial {
  public:
    TCOSerial();
    void begin(int bufferSize);
	boolean readSerial();
    void writeSerial(byte *writeQueue, byte size);
	byte inCommingMessageSize();
	byte *readQueue;
  private:
    byte messageSize;
    boolean nextEscaped;
	boolean newMessage;
    byte ESCAPE;
    byte BOUNDARY;
    byte ESCAPEINV;
    byte BOUNDARYINV;
};

TCOSerial::TCOSerial() {
}

void TCOSerial::begin(int bufferSize) {
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

boolean TCOSerial::readSerial(){
  if(newMessage){
    messageSize = 0;
	newMessage = false;
  }
  while(Serial.available() > 0)
  {
    byte input = Serial.read();
    if (nextEscaped){
      if(input == ESCAPEINV){
        readQueue[messageSize++] = ESCAPE;
      }
      else if(input == BOUNDARYINV){
        readQueue[messageSize++] = BOUNDARY;
      }
      // could be that input is not 93 or 94, which is an error
      nextEscaped = false;
    }
    else if(input == ESCAPE){
      nextEscaped = true;
    }
    else if(input == BOUNDARY){
	  newMessage = true;
	  return true;
    }
    else{
      readQueue[messageSize++] = input;
    }
  }
  return false;
}

void TCOSerial::writeSerial(byte *writeQueue, byte size){
  byte i = 0;
  while (i < size){
    byte character = writeQueue[i++];
    if(character == ESCAPE){
      Serial.write(ESCAPE);
      Serial.write(ESCAPEINV);
    }
    else if(character == BOUNDARY){
      Serial.write(ESCAPE);
      Serial.write(BOUNDARYINV);
    }
    else{
      Serial.write(character);
    }
  }
  Serial.write(BOUNDARY);
}

byte TCOSerial::inCommingMessageSize(){
  return messageSize;
}
#endif
