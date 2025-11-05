import type { QuoteFormData, Quote, LineItem } from '../types';

// This is a data structure to define pre-set packages for certain services.
export const PACKAGE_DATA: Record<string, { name: string; description: string; includedAddons: string[] }[]> = {
    'Corporate Video': [
        { name: 'Starter', description: 'A basic package for interviews and simple corporate messages.', includedAddons: ['Two-Camera Interview Setup'] },
        { name: 'Standard', description: 'Includes professional scripting and advanced editing for a polished look.', includedAddons: ['Two-Camera Interview Setup', 'Full Scriptwriting & Storyboarding', 'Advanced Editing & Color Grading'] },
        { name: 'Premium', description: 'Our all-inclusive package with motion graphics and voice-over for a high-impact video.', includedAddons: ['Two-Camera Interview Setup', 'Full Scriptwriting & Storyboarding', 'Advanced Editing & Color Grading', 'Custom Motion Graphics', 'Professional Voice-over'] },
    ],
    'Promotional/Brand Video': [
        { name: 'Essential', description: 'A dynamic video with advanced concept development.', includedAddons: ['Advanced Storyboarding & Concept'] },
        { name: 'Cinematic', description: 'Elevate your brand with custom sound and high-end graphics.', includedAddons: ['Advanced Storyboarding & Concept', 'Advanced 2D/3D Motion Graphics', 'Custom Sound Design & Mixing'] },
        { name: 'Ultimate', description: 'The complete package including on-set professionals for a premium production.', includedAddons: ['Advanced Storyboarding & Concept', 'Advanced 2D/3D Motion Graphics', 'Custom Sound Design & Mixing', 'Hair & Makeup Artist'] },
    ],
    'Wedding Videography': [
        { name: 'Silver', description: 'Full-day coverage with one camera.', includedAddons: [] },
        { name: 'Gold', description: 'Comprehensive coverage with two cameras.', includedAddons: ['Second Camera'] },
    ]
};

const RETAINER_PRICING = {
    firstHourRate: 1000,
    subsequentHourRate: 400,
    addons: {
        'Second Camera': 800,
        'Advanced Shooting Tools': '50%_base', // Special value for dynamic calculation
        'Full Scriptwriting & Storyboarding': 1200,
        'Advanced Editing & Color Grading': 900,
        'Custom Motion Graphics': 1000,
        'Professional Voice-over': 600,
    }
};

const TRAINING_PRICING = {
    'Private (one-on-one)': {
        baseRate: 500, // per hour
        addons: {
            'Camera Rental': 100, // per hour
            'Classroom Rental': 150, // per hour
        }
    },
    'Group': {
        baseRate: 900, // per hour
        addons: {
            'Classroom Rental': 200, // per hour
        }
    }
};

export const PROJECT_PRICING = {
    'Photography': {
        'Event Photography': {
            options: { duration: { 'Per Hour': { firstHour: 500, additional: 300 }, 'Half Day (4 hours)': 1200, 'Full Day (8 hours)': 2000 } },
            addons: { 'Second Camera': '80%_base', 'Additional Hours': 300 }
        },
        'Real Estate Photography': {
            options: {
                propertySize: { 
                    'Studio': { 'Unfurnished': 500, 'Furnished': 800 },
                    '1-Bedroom': { 'Unfurnished': 700, 'Furnished': 1100 },
                    '2-Bedroom': { 'Unfurnished': 900, 'Furnished': 1400 },
                    '3-Bedroom': { 'Unfurnished': 1100, 'Furnished': 1600 },
                    'Villa': { 'Unfurnished': 1500, 'Furnished': 3000 }
                },
                furnishing: ['Unfurnished', 'Furnished']
            }
        },
        'Corporate/Business Headshots': { perPerson: 350 },
        'Product Photography': { perItem: 200, addons: { 'Styling Setup': { perItem: 200 } } },
        'Food Photography': { perItem: 250, addons: { 'Styling Setup': { perItem: 250 } } },
        'Fashion/Lifestyle Photography': {
            options: { fashionDuration: { 'Per Hour': 1500, 'Half-day Session': 5000 } },
            addons: { 'Second Camera': '80%_base' }
        },
        'Wedding Photography': { base: 5000, addons: { 'Second Camera': '100%_base' } },
    },
    'Video Production': {
        'Event Videography': {
            options: { duration: { 'Per Hour': 400, 'Half Day (4 hours)': 1200, 'Full Day (8 hours)': 2200 } },
            addons: { 'Second Camera': '100%_base', 'Additional Hours': 400 }
        },
        'Corporate Video': {
            base: 2000,
            addons: { 'Extended Filming (Half-Day)': 800, 'Extended Filming (Full-Day)': 1500, 'Two-Camera Interview Setup': 600, 'Full Scriptwriting & Storyboarding': 1200, 'Advanced Editing & Color Grading': 900, 'Custom Motion Graphics': 1000, 'Professional Voice-over': 600 }
        },
        'Promotional/Brand Video': {
            base: 3000,
            addons: { 'Extended Full-Day Production': 1500, 'Multi-Location Shoot': 500, 'Advanced Storyboarding & Concept': 1500, 'Advanced 2D/3D Motion Graphics': 1800, 'Custom Sound Design & Mixing': 1200, 'Hair & Makeup Artist': 800 }
        },
        'Real Estate Videography': {
            options: { propertySize: { 'Studio': 600, '1-Bedroom Apartment': 800, '2-Bedroom Apartment': 1000, '3-Bedroom Apartment': 1200, 'Villa': 2000 } }
        },
        'Wedding Videography': { base: 3500, addons: { 'Second Camera': '80%_base' } }
    },
    'Post Production': {
        'Video Editing': {
            options: { editType: { 'Per Hour': 250, 'Per Finished Minute': 800, 'Social Media Edit (15-60s)': 500 } }
        },
        'Photo Editing (Retouching)': {
            options: { retouchType: { 'Basic Retouching': 30, 'Advanced Retouching': 100, 'Photo Restoration': 150 } }
        }
    },
    '360 Tours': {
        options: { subService: { 'Studio Apartment': 600, '1-Bedroom Apartment': 750, '2-Bedroom Apartment': 900, '3-Bedroom Villa': 1500 } }
    },
    'Time Lapse': {
        options: { subService: { 'Short Term (1-10 hours)': 100, 'Long Term (Days/Weeks)': 200, 'Extreme Long Term (Months/Years)': 3000 } },
        addons: { 'Extra Camera': '80%_base' }
    },
    'Photogrammetry': {
        options: { subService: { 'Small Scale Object': 500, 'Single Residential Property (Exterior Only)': 2000, 'Single Residential Property (Exterior & Interior)': 3500, 'Commercial Building': 5000, 'Large-Scale Infrastructure': 10000 } }
    }
};

/**
 * Calculates the base price for a project based on service and configuration, excluding addons and global modifiers.
 */
function getProjectBasePrice(service: string, subService: string, config: any): number {
    if (!service || !subService) return 0;

    const servicePricing = (PROJECT_PRICING as any)[service];
    if (!servicePricing) return 0;

    let totalBasePrice = 0;
    
    // Logic for services where sub-service is a key under options.subService
    if (service === '360 Tours' || service === 'Photogrammetry' || service === 'Time Lapse') {
        const priceFromOptions = servicePricing.options?.subService?.[subService];
        if (typeof priceFromOptions === 'number') {
            if (service === 'Time Lapse') {
                totalBasePrice += priceFromOptions * (config.duration || 1);
            } else {
                totalBasePrice += priceFromOptions;
            }
        }
    } else { // Logic for services where sub-service is a direct key (e.g., Photography)
        const subServicePricing = servicePricing[subService];
        if (!subServicePricing) return 0;

        // 1. Add flat base rate, if it exists
        totalBasePrice += subServicePricing.base || 0;

        // 2. Add price from selected options
        if (subServicePricing.options) {
             if (config.duration && subServicePricing.options.duration?.[config.duration]) {
                const durationPrice = subServicePricing.options.duration[config.duration];
                if (config.duration === 'Per Hour' && typeof durationPrice === 'object' && 'firstHour' in durationPrice) {
                    const hours = config.hours || 1;
                    totalBasePrice += durationPrice.firstHour + Math.max(0, hours - 1) * durationPrice.additional;
                } else if (typeof durationPrice === 'number') {
                    totalBasePrice += durationPrice;
                }
            }
            if (config.fashionDuration && subServicePricing.options.fashionDuration?.[config.fashionDuration]) {
                totalBasePrice += subServicePricing.options.fashionDuration[config.fashionDuration];
            }
            if (config.propertySize && subServicePricing.options.propertySize?.[config.propertySize] && config.furnishing) {
                const priceConfig = subServicePricing.options.propertySize[config.propertySize];
                if(typeof priceConfig === 'object' && priceConfig[config.furnishing]) {
                    totalBasePrice += priceConfig[config.furnishing];
                }
            }
            if (config.editType && subServicePricing.options.editType?.[config.editType]) {
                totalBasePrice += subServicePricing.options.editType[config.editType] * (config.quantity || 1);
            }
            if (config.retouchType && subServicePricing.options.retouchType?.[config.retouchType]) {
                totalBasePrice += subServicePricing.options.retouchType[config.retouchType] * (config.photos || 1);
            }
        }

        // 3. Add per-item or per-person costs
        if (subServicePricing.perPerson && config.persons) {
            totalBasePrice += subServicePricing.perPerson * config.persons;
        }
        if (subServicePricing.perItem && config.items) {
            totalBasePrice += subServicePricing.perItem * config.items;
        }
    }
    return totalBasePrice;
}


/**
 * Calculates a quote based on the user's form data.
 */
export const calculateQuote = (formData: QuoteFormData): Quote => {
    const { engagementType, service, config, contact } = formData;
    const lineItems: LineItem[] = [];
    let projectName = "Project";
    let notes = "";
    
    if (engagementType === 'Project' && service && config.subService) {
        projectName = `${service} for ${contact.company || contact.name}`;
        const servicePricing = (PROJECT_PRICING as any)[service];
        const subServicePricing = servicePricing?.[config.subService];
        
        let basePrice = 0;
        let mainServiceProcessed = false;

        // --- Handle Main Service Line Item (with quantity if applicable) ---
        if (service === 'Photography' && subServicePricing) {
            if (config.subService === 'Corporate/Business Headshots' && subServicePricing.perPerson && config.persons > 0) {
                basePrice = subServicePricing.perPerson * config.persons;
                lineItems.push({ description: `${service} - ${config.subService}`, quantity: config.persons, rate: subServicePricing.perPerson, total: basePrice });
                mainServiceProcessed = true;
            } else if ((config.subService === 'Product Photography' || config.subService === 'Food Photography') && subServicePricing.perItem && config.items > 0) {
                basePrice = subServicePricing.perItem * config.items;
                lineItems.push({ description: `${service} - ${config.subService}`, quantity: config.items, rate: subServicePricing.perItem, total: basePrice });
                mainServiceProcessed = true;
            }
        } else if (service === 'Post Production' && config.subService === 'Photo Editing (Retouching)' && config.retouchType && config.photos > 0) {
            const rate = subServicePricing.options.retouchType[config.retouchType];
            basePrice = rate * config.photos;
            lineItems.push({ description: `${service} - ${config.retouchType}`, quantity: config.photos, rate: rate, total: basePrice });
            mainServiceProcessed = true;
        }

        // Generic fallback for services without special quantity logic
        if (!mainServiceProcessed) {
            basePrice = getProjectBasePrice(service, config.subService, config);
            if (basePrice > 0) {
                let description = `${service} - ${config.subService}`;
                if (config.hours && ((service === 'Photography' && config.subService === 'Event Photography' && config.duration === 'Per Hour') || (service === 'Video Production' && config.subService === 'Event Videography' && config.duration === 'Per Hour'))) {
                    description += ` (${config.hours} hour${config.hours > 1 ? 's' : ''})`;
                }
                if (config.quantity && service === 'Post Production' && config.subService === 'Video Editing' && config.editType) {
                     if (config.editType === 'Per Hour') description += ` (${config.quantity} hour${config.quantity > 1 ? 's' : ''})`;
                     else if (config.editType === 'Per Finished Minute') description += ` (${config.quantity} minute${config.quantity > 1 ? 's' : ''})`;
                }
                lineItems.push({ description: description, quantity: 1, rate: basePrice, total: basePrice });
            }
        }

        // --- Handle Add-ons ---
        const addonConfig = subServicePricing?.addons || servicePricing?.addons;
        let addonsToProcess = [...(config.addons || [])];

        // Specific addon logic for styling setup per item
        if ((config.subService === 'Product Photography' || config.subService === 'Food Photography') && addonsToProcess.includes('Styling Setup') && addonConfig['Styling Setup']?.perItem && config.items > 0) {
            const addonRate = addonConfig['Styling Setup'].perItem;
            lineItems.push({ description: 'Add-on: Styling Setup', quantity: config.items, rate: addonRate, total: addonRate * config.items });
            addonsToProcess = addonsToProcess.filter(a => a !== 'Styling Setup');
        }

        if (addonsToProcess.length && addonConfig) {
            addonsToProcess.forEach((addon: string) => {
                const addonPriceConfig = addonConfig[addon];
                let addonPrice = 0;
                if (typeof addonPriceConfig === 'number') {
                    addonPrice = addonPriceConfig;
                } else if (typeof addonPriceConfig === 'string' && addonPriceConfig.endsWith('%_base')) {
                    addonPrice = basePrice * (parseFloat(addonPriceConfig) / 100);
                }
                if (addonPrice > 0) lineItems.push({ description: `Add-on: ${addon}`, quantity: 1, rate: addonPrice, total: addonPrice });
            });
        }
        
        if (service === 'Photography' && config.subService === 'Event Photography' && config.additionalHours > 0) {
            const rate = addonConfig['Additional Hours'];
            lineItems.push({ description: `Add-on: Additional Hours`, quantity: config.additionalHours, rate: rate, total: rate * config.additionalHours });
        }

        // --- Handle Logistics and Delivery ---
        if (config.logistics && config.logistics !== 'Dubai') {
            const logisticsCost = config.logistics === 'Sharjah' ? 100 : 200;
            lineItems.push({ description: `Logistics & Travel: ${config.logistics}`, quantity: 1, rate: logisticsCost, total: logisticsCost });
        }
        
        const subtotalBeforeRush = lineItems.reduce((sum, item) => sum + item.total, 0);
        if (config.delivery === 'Rush Delivery (24h)') {
            const rushFee = subtotalBeforeRush * 0.5;
            lineItems.push({ description: 'Rush Delivery (24h) Surcharge (50%)', quantity: 1, rate: rushFee, total: rushFee });
        }

    } else if (engagementType === 'Retainer' && config.hours && config.hours > 0) {
        projectName = `Monthly Retainer for ${contact.company || contact.name}`;
        let basePrice = RETAINER_PRICING.firstHourRate + Math.max(0, config.hours - 1) * RETAINER_PRICING.subsequentHourRate;
        lineItems.push({ description: `Monthly Retainer Base (${config.hours} hours)`, quantity: 1, rate: basePrice, total: basePrice });
        config.retainerAddons?.forEach(addon => {
            const addonPriceConfig = (RETAINER_PRICING.addons as any)[addon];
            let addonPrice = (typeof addonPriceConfig === 'number') ? addonPriceConfig : (addonPriceConfig === '50%_base' ? basePrice * 0.5 : 0);
            if (addonPrice > 0) lineItems.push({ description: `Add-on: ${addon}`, quantity: 1, rate: addonPrice, total: addonPrice });
        });

    } else if (engagementType === 'Training' && config.subService && config.hours && config.hours > 0) {
        projectName = `Training Session for ${contact.company || contact.name}`;
        const trainingType = config.subService as keyof typeof TRAINING_PRICING;
        const pricing = TRAINING_PRICING[trainingType];
        if (pricing) {
            lineItems.push({ description: `${trainingType} Training Session`, quantity: config.hours, rate: pricing.baseRate, total: pricing.baseRate * config.hours });
            config.addons?.forEach((addon: string) => {
                const addonRate = (pricing.addons as any)[addon];
                if (addonRate > 0) lineItems.push({ description: `Add-on: ${addon}`, quantity: config.hours, rate: addonRate, total: addonRate * config.hours });
            });
        }
    }

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const now = new Date();
    const quoteNumber = `${now.getDate()}${now.getMonth() + 1}${now.getHours()}${now.getMinutes().toString().padStart(2, '0')}`;

    return {
        quoteNumber,
        date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        clientName: contact.name,
        clientEmail: contact.email,
        clientPhone: contact.phone,
        clientCompany: contact.company,
        projectName,
        lineItems,
        subtotal,
        grandTotal: subtotal,
        notes,
    };
};