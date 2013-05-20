/*
  CapacitiveSense.h v.04 - Capacitive Sensing Library for 'duino / Wiring
  Copyright (c) 2008 Paul Bagder  All rights reserved.
  Version 04 by Paul Stoffregen - Arduino 1.0 compatibility, issue 146 fix
  vim: set ts=4:
*/
/*
  Modified by Christian Olsson, Kåre Sylow and Henrik Haugboelle 2013
*/

#if ARDUINO >= 100
#include "Arduino.h"
#else
#include "WProgram.h"
#include "pins_arduino.h"
#include "WConstants.h"
#endif

#include "TouchSensor.h"

TouchSensor::TouchSensor(uint8_t sendPin, uint8_t receivePin, int _timeout)
{
	uint8_t sPort, rPort;

	timeout = _timeout;
	
	sBit =  digitalPinToBitMask(sendPin);			// get send pin's ports and bitmask
	sPort = digitalPinToPort(sendPin);
	sReg = portModeRegister(sPort);
	sOut = portOutputRegister(sPort);				// get pointer to output register   

	rBit = digitalPinToBitMask(receivePin);			// get receive pin's ports and bitmask 
	rPort = digitalPinToPort(receivePin);
	rReg = portModeRegister(rPort);
	rIn  = portInputRegister(rPort);
   	rOut = portOutputRegister(rPort);
	
	// get pin mapping and port for receive Pin - from digital pin functions in Wiring.c
    noInterrupts();
	*sReg |= sBit;              // set sendpin to OUTPUT 
    interrupts();
}

long TouchSensor::read(int samples)
{
	total = 0;

	for (int i = 0; i < samples; i++) {
		SenseOneCycle();
	}

	return total;
}


int TouchSensor::SenseOneCycle(void)
{
    noInterrupts();
	*sOut &= ~sBit;        // set Send Pin Register low
	
	*rReg &= ~rBit;        // set receivePin to input
	*rOut &= ~rBit;        // set receivePin Register low to make sure pullups are off
	
	*rReg |= rBit;         // set pin to OUTPUT - pin is now LOW AND OUTPUT
	*rReg &= ~rBit;        // set pin to INPUT 

	*sOut |= sBit;         // set send Pin High
    interrupts();

	while ( !(*rIn & rBit)  && (total < timeout) ) {
		total++;
	}
    
	// set receive pin HIGH briefly to charge up fully - because the while loop above will exit when pin is ~ 2.5V 
    noInterrupts();
	*rOut  |= rBit;        // set receive pin HIGH - turns on pullup 
	*rReg |= rBit;         // set pin to OUTPUT - pin is now HIGH AND OUTPUT
	*rReg &= ~rBit;        // set pin to INPUT 
	*rOut  &= ~rBit;       // turn off pullup

	*sOut &= ~sBit;        // set send Pin LOW
    interrupts();

	while ( (*rIn & rBit) && (total < timeout) ) {  // while receive pin is HIGH  AND total is less than timeout
		total++;
	}
}