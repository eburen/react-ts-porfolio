import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
    MobileStepper,
    useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface SaleBanner {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor: string;
    textColor: string;
}

// Sample data - this would come from your API in a real application
const sampleBanners: SaleBanner[] = [
    {
        id: 1,
        title: 'Summer Flash Sale!',
        description: 'Up to 50% off on selected items. Limited time offer!',
        imageUrl: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        buttonText: 'Shop Now',
        buttonLink: '/products?sale=true',
        backgroundColor: '#ff9800',
        textColor: '#ffffff'
    },
    {
        id: 2,
        title: 'New Arrivals',
        description: 'Check out our latest products with special introductory prices!',
        imageUrl: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        buttonText: 'Explore',
        buttonLink: '/products?new=true',
        backgroundColor: '#2196f3',
        textColor: '#ffffff'
    },
    {
        id: 3,
        title: 'Clearance Sale',
        description: 'Last chance to grab these items before they're gone!',
    imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        buttonText: 'View Deals',
        buttonLink: '/products?clearance=true',
        backgroundColor: '#f44336',
        textColor: '#ffffff'
    }
];

const SalesBanner: React.FC = () => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [banners, setBanners] = useState<SaleBanner[]>(sampleBanners);
    const maxSteps = banners.length;

    // In a real application, you would fetch the banner data from your API
    useEffect(() => {
        // Example API call:
        // const fetchBanners = async () => {
        //   try {
        //     const response = await api.get('/banners');
        //     setBanners(response.data);
        //   } catch (error) {
        //     console.error('Failed to fetch banners:', error);
        //   }
        // };
        // fetchBanners();
    }, []);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <Container maxWidth="lg" sx={{ mb: 6 }}>
            <Paper
                elevation={3}
                sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                <AutoPlaySwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                    interval={6000}
                >
                    {banners.map((banner, index) => (
                        <div key={banner.id}>
                            {Math.abs(activeStep - index) <= 2 ? (
                                <Box
                                    sx={{
                                        height: { xs: 300, md: 400 },
                                        position: 'relative',
                                        backgroundColor: banner.backgroundColor,
                                        backgroundImage: `url(${banner.imageUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            padding: 4,
                                        }}
                                    >
                                        <Typography
                                            variant="h3"
                                            component="h2"
                                            color="white"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 'bold',
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                                fontSize: { xs: '2rem', md: '3rem' }
                                            }}
                                        >
                                            {banner.title}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            color="white"
                                            paragraph
                                            sx={{
                                                maxWidth: 600,
                                                mb: 4,
                                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                                fontSize: { xs: '1rem', md: '1.25rem' }
                                            }}
                                        >
                                            {banner.description}
                                        </Typography>
                                        <Button
                                            component={Link}
                                            to={banner.buttonLink}
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                backgroundColor: 'white',
                                                color: banner.backgroundColor,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                },
                                                fontWeight: 'bold',
                                                px: 4,
                                                py: 1,
                                            }}
                                        >
                                            {banner.buttonText}
                                        </Button>
                                    </Box>
                                </Box>
                            ) : null}
                        </div>
                    ))}
                </AutoPlaySwipeableViews>

                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button
                            size="small"
                            onClick={handleNext}
                            endIcon={theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                        >
                            Next
                        </Button>
                    }
                    backButton={
                        <Button
                            size="small"
                            onClick={handleBack}
                            startIcon={theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        >
                            Back
                        </Button>
                    }
                />
            </Paper>
        </Container>
    );
};

export default SalesBanner; 