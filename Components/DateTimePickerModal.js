import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateTimePicker = ({ isVisible, mode, onConfirm, onCancel }) => {
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode={mode}
      onConfirm={onConfirm}
      onCancel={onCancel}
      
    />
  );
};

export default DateTimePicker;