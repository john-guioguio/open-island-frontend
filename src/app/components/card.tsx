'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from '@mui/material';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));
type itemDataType = {
    img: string;
    title: string;
    author: string;
}
export default function RecipeReviewCard({ item }: { item: itemDataType }) {
    const [expanded, setExpanded] = React.useState<boolean>(false);
    const [onHover, setHover] = React.useState<boolean>(false);
 
    return (
        <Card
            sx={{
                maxWidth: 405,
                backgroundImage: `url(${item.img})`,
                bgcolor: 'white',
                maxHeight: 140,
                display: 'block',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                backgroundSize: 'cover',
            }}
            onMouseEnter={() => { setHover(true) }}
            onMouseLeave={() => { setHover(false) }}
        >
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500], }} aria-label="recipe">
                        {item.author[1]}
                    </Avatar>
                }
                sx={{
                    opacity: onHover ? 1 : 0,
                    color: 'white',
                    background: 'linear-gradient( rgb(0, 0, 0),rgba(255,255,255,0))', 
                }}
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={item.author}
            />
            {/* <CardMedia
                component="img"
                height="100%"
                width="100%"
                image={item.img}
                alt="Paella dish"
            />  */}
            <Box sx={{
                width: '100%',
                height: '30vh',
                opacity: onHover ? 1 : 0,
                // background: 'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0), rgba(255,255,255,0.8), rgba(255,255,255,1))',
                background: 'linear-gradient(rgba(255,255,255,0), rgb(0, 0, 0), rgb(0, 0, 0))', 
            }}>

                <Typography variant="body2" sx={{
                    width: '100%',
                    position: 'absolute',
                    height: '15%',
                    bottom: 0,
                    left: 0,
                    color: 'white', 
                    textAlign: 'bottom',
                }}>
                    {item.title}
                </Typography>
            </Box>



        </Card>
    );
}
