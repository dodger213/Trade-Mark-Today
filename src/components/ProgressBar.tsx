import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export default function ProgressLinearWithValueLabel({ setVar: { uploadProgress, setUploadProgress } }: { setVar: { uploadProgress: number, setUploadProgress: React.Dispatch<React.SetStateAction<number>> } }) {
    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={uploadProgress} />
        </Box>
    );
}