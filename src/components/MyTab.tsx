
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ReactNode, useState } from 'react';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
}


const a11yProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const MyTab = ({ titles, props:{value,setValue}, children }: {
  titles: string[],
  props: {
    value: number,
    setValue: React.Dispatch<React.SetStateAction<number>>
  },
  children: ReactNode
}) => {
  const theme = useTheme();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  return (
    <>
      {/* <Box sx={{ bgcolor: 'background.paper', width: 500 }}> */}
      {/* <AppBar position="static"> */}
      <Tabs
        className='w-full'
        style={{
          borderBottom: '1px solid #e8e8e8'}}
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        {titles.map((title, index) => (<Tab key={index} label={title} {...a11yProps(index)} />))}
      </Tabs>
      {/* </AppBar> */}
        {/* <style> {`.react-swipeable-view-container{transition: height .5s, transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s!important; height:${value==0?"200px":"400px"};}`} </style> */}
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        className='w-full'
        onChangeIndex={handleChangeIndex}
      >
        {children}
      </SwipeableViews>
      {/* </Box> */}
    </>
  );
}
export default MyTab;