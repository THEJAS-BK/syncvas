import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
export default function Hero() {
    return(
        <div className= "flex flex-col flex-1 items-center">
           <div className='flex flex-col mt-60 border-2 items-center p-4 rounded-lg'>
             <div className='mx-auto text-center pb-7'>
                <h2 className="text-4xl font-bold mb-5">Welcome to the Hero Section</h2>
                <Button variant="contained">Get whiteboard</Button>
            </div>
            <Stack spacing={2} direction="row" className='mx-auto'>
                <Button variant="outlined">join Room</Button>
                <p>Or</p>
                <Button variant="contained" color="success">create Room</Button>
            </Stack>    
           </div>

        </div>
    ) 
};
