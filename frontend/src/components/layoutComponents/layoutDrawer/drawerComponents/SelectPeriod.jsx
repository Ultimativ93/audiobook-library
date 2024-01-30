import React, { useState } from 'react';
import { Button, Input, Flex, Spacer } from '@chakra-ui/react';
import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectPeriod = ({ nodeData, setNodes }) => {
  const [periods, setPeriods] = useState(nodeData.data.answerPeriods);

  const handleAddPeriod = () => {
    setPeriods([...periods, { start: '', end: '' }]);
  };

  const handlePeriodChange = (index, field, value) => {
    const updatedPeriods = [...periods];
    updatedPeriods[index][field] = value;
    setPeriods(updatedPeriods);
    updateNodeProperty(setNodes, nodeData, 'answerPeriods', updatedPeriods);
  };

  const handleRemovePeriod = (index) => {
    const newPeriods = [...periods];
    newPeriods.splice(index, 1);
    setPeriods(newPeriods);
    updateNodeProperty(setNodes, nodeData, 'answerPeriods', newPeriods);
  };

  return (
    <>
      <h4>Period Based Reactions</h4>
      {periods.map((period, index) => (
        <Flex key={index} direction="column" align="start">
          <Flex align="center">
            <Input
              placeholder='00:00'
              value={period.start}
              onChange={(e) => handlePeriodChange(index, 'start', e.target.value)}
              flex="5"
            />
            <Spacer />
            <Input
              placeholder='00:00'
              value={period.end}
              onChange={(e) => handlePeriodChange(index, 'end', e.target.value)}
              flex="5"
            />
          </Flex>
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => handleRemovePeriod(index)}
          >
            Remove Period
          </Button>
        </Flex>
      ))}
      <Button colorScheme="blue" size="sm" onClick={handleAddPeriod}>
        Add Period
      </Button>
    </>
  );
};

export default SelectPeriod;
