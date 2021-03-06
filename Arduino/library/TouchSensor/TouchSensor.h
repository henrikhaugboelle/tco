/*
  CapacitiveSense.h v.04 - Capacitive Sensing Library for 'duino / Wiring
  Copyright (c) 2008 Paul Bagder  All rights reserved.
  Version 04 by Paul Stoffregen - Arduino 1.0 compatibility, issue 146 fix
  vim: set ts=4:
*/
/*
  Modified by Christian Olsson, Kåre Sylow and Henrik Haugboelle 2013
*/

// ensure this library description is only included once
#ifndef TouchSensor_h
#define TouchSensor_h

#if ARDUINO >= 100
#include "Arduino.h"
#else
#include "WProgram.h"
#endif

// library interface description
class TouchSensor
{
  // user-accessible "public" interface
  public:
  // methods
	TouchSensor(uint8_t sendPin, uint8_t receivePin, int _timeout);
	long read(int samples);
  // library-accessible "private" interface
  private:
  // variables
	unsigned long  timeout;
	unsigned long  total;
	uint8_t sBit;   // send pin's ports and bitmask
	volatile uint8_t *sReg;
	volatile uint8_t *sOut;
	uint8_t rBit;    // receive pin's ports and bitmask 
	volatile uint8_t *rReg;
	volatile uint8_t *rIn;
	volatile uint8_t *rOut;
  // methods
	int SenseOneCycle(void);
};

#endif
