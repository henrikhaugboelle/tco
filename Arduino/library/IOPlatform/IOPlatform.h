/*
 *  IOPlatform.h
 */

#ifndef _IOPlatform_H
#define _IOPlatform_H

#include <Arduino.h>
#include <SerialFraming.h>

// Definition of the callback used for setting the state of the IO-device
typedef void(*SetCallback)(byte *queue, int length);
// Definition of the callback used for sending sensor values to the server
typedef int(*SendCallback)(byte *queue, int bufferSize);

// This class serves a platform for implementations of projects within remote awareness
// The class deals with the communication with the dockingstation
class IOPlatform {
  public:
    IOPlatform();
    void begin(int inputSize, int outputSize);
    void setSetState(SetCallback callback);
	void setSendValues(SendCallback callback);
	void setWait(int wait);
  private:
	// Class used for framming of serial messages
	SerialFraming serialFraming;
	// Callback for setting the state of the IO-device
	SetCallback setState;
	// Callback for sending sensor values to the server
	SendCallback sendValues;
	// The number of cykles to wait before between sending messages to the server
	int waitSend;
};

// Constructor
IOPlatform::IOPlatform() {
	waitSend = 0;
}

// This method delegates the control to the platform
// The method is blocking and will be calling the callbacks for input and output
void IOPlatform::begin(int inputBuffer, int outputBuffer) {
    serialFraming.begin(inputBuffer);
	byte *writeQueue = (byte *)malloc(outputBuffer * sizeof(int));
    int timer = 0;
	
	while(true){
		byte *readQueue = serialFraming.readFrame();
		
		// If input has been received
		if(readQueue){
			setState(readQueue, serialFraming.inCommingMessageSize());
		}
  
		// If the timer has run out, send a message to the server
		if(timer > waitSend){
			int length = sendValues(writeQueue, outputBuffer);
			serialFraming.writeFrame(writeQueue, length);
			timer = 0;
		}
		
		timer++;
	}
}

// Method used for setting the callback to control input from the server
void IOPlatform::setSetState(SetCallback callback) {
	setState = *callback;
}

// Method used for setting the callback to control output to the server
void IOPlatform::setSendValues(SendCallback callback) {
	sendValues = *callback;
}

// Method used for setting the value of the timer
void IOPlatform::setWait(int wait) {
	waitSend = wait;
}
#endif
