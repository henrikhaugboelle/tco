/*
 *  TCOPlatform.h
 */

#ifndef _TCOPlatform_H
#define _TCOPlatform_H

#include <Arduino.h>
#include <TCOSerial.h>

typedef void(*SetCallback)(byte *queue, int length);
typedef int(*SendCallback)(byte *queue, int length);

class TCOPlatform {
  public:
    TCOPlatform();
    void begin(int inputSize, int outputSize);
    void setSetState(SetCallback callback);
	void setSendValues(SendCallback callback);
	void setWait(int wait);
  private:
	TCOSerial tcoSerial;
	SetCallback setState;
	SendCallback sendValues;
	int waitSend;
};

TCOPlatform::TCOPlatform() {
}

void TCOPlatform::begin(int inputBuffer, int outputBuffer) {
    tcoSerial.begin(inputBuffer);
	byte *writeQueue = (byte *)malloc(outputBuffer * sizeof(int));
    int timer = 0;
	waitSend = 100;
	while(true){
		if(tcoSerial.readSerial()){
			setState(tcoSerial.readQueue, tcoSerial.inCommingMessageSize());
		}
  
		if(timer > waitSend){
			int length = sendValues(writeQueue, outputBuffer);
			tcoSerial.writeSerial(writeQueue, length);
			timer = 0;
		}
		timer++;

	}
}

void TCOPlatform::setSetState(SetCallback callback) {
	setState = *callback;
}

void TCOPlatform::setSendValues(SendCallback callback) {
	sendValues = *callback;
}

void TCOPlatform::setWait(int wait) {
	waitSend = wait;
}
#endif
