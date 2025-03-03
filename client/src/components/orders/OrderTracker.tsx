import React from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Paper,
    Divider,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface OrderTrackerProps {
    status: string;
    createdAt: string;
    paidAt?: string;
    deliveredAt?: string;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({
    status,
    createdAt,
    paidAt,
    deliveredAt,
}) => {
    // Define the steps based on the order status
    const getSteps = () => {
        return ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
    };

    // Get the active step based on the order status
    const getActiveStep = () => {
        switch (status) {
            case 'pending':
                return 0;
            case 'processing':
                return 1;
            case 'shipped':
                return 2;
            case 'delivered':
                return 3;
            case 'cancelled':
                return -1; // Special case for cancelled orders
            default:
                return 0;
        }
    };

    const steps = getSteps();
    const activeStep = getActiveStep();

    // Format date for display
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Pending';
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    // Get the date for each step
    const getStepDate = (step: number) => {
        switch (step) {
            case 0:
                return formatDate(createdAt);
            case 1:
                return paidAt ? formatDate(paidAt) : 'Pending';
            case 2:
                return activeStep >= 2 ? 'In Transit' : 'Pending';
            case 3:
                return deliveredAt ? formatDate(deliveredAt) : 'Pending';
            default:
                return 'Pending';
        }
    };

    if (status === 'cancelled') {
        return (
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.light' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CancelIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="error">
                        Order Cancelled
                    </Typography>
                </Box>
                <Typography variant="body2">
                    This order was cancelled on {formatDate(createdAt)}.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Order Status
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>
                                {label}
                                <Typography variant="caption" display="block">
                                    {getStepDate(index)}
                                </Typography>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <Box sx={{ mt: 3 }}>
                {activeStep === steps.length ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                            Order completed! Your order has been delivered.
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body1">
                        {status === 'pending'
                            ? 'Your order has been placed and is awaiting processing.'
                            : status === 'processing'
                                ? 'Your order is being processed and prepared for shipping.'
                                : status === 'shipped'
                                    ? 'Your order has been shipped and is on its way to you.'
                                    : 'Your order is out for delivery.'}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default OrderTracker; 