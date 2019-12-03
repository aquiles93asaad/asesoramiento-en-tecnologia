export interface Computer {
    _id?: string;
    name: string;
    brand: string;
    model: string;
    releaseDate: Date;
    computerType: string;
    availableAt: {
        store: string,
        url: string,
        price: number
    }[];
    price: number;
    images: string[];
    rating: number;
    comments: {
        comment: string;
        rating: number;
        user: string;
        date: Date;
    }[];
    specifications: {
        processor: Processor;
        memory: Memory;
        graphicsCard: GraphicsCard;
        connectivity: Connectivity;
        battery: Battery;
        dimensions: Dimensions;
        storage: Storage
        operatingSystem: string;
    };
    scores: {
        processorScore: number;
        ramScore: number;
        storageScore: number;
        graphicsCardScore: number;
    };
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: string;
}

interface Processor {
    brand: string;
    model: string;
    version: string;
    rate: number;
    cores: number;
    cache: number;
}

interface Memory {
    ram: number;
    ramType: string;
    speed: number;
    expandableRam: number;
}

interface GraphicsCard {
    brand: string;
    graphicCardType: string;
    processorRate: number;
    ram: number;
    ramType: string;
}

interface Connectivity {
    wifi: boolean;
    bluetooth: boolean;
    usb2Ports: number;
    usb3Ports: number;
    usbCPorts: number;
    ethernetPort: boolean;
    hdmiPort: boolean;
    hdmiMiniPort: boolean;
    vgaPort: boolean;
    microphone: boolean;
    webCam: boolean;
}

interface Battery {
    duration: number;
    restDuration: number;
    isExpandible: boolean;
}

interface Dimensions {
    width: number;
    height: number;
    depth: number;
    weight: number;
}

interface Storage {
    space: number;
    storageType: string;
    speed: number;
}
