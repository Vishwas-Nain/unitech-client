import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  Card,
  CardContent,
  Button,
  Rating,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Paper,
  CardMedia,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  InputAdornment,
  styled,
  useTheme,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  DialogContentText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReplayIcon from '@mui/icons-material/Replay';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

// TODO: For each Windows laptop in your product data, add a configOptions property like:
// configOptions: {
//   ram: [{ value: '4GB', label: '4GB', price: 0 }, ...],
//   storage: [...],
//   processor: [...],
// }
// Then, only those laptops will show configurable options in the dialog.


const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  },
  borderRadius: '12px',
  overflow: 'hidden'
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
  display: 'flex',
  flexDirection: 'column'
}));

const StyledButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow: theme.shadows[24]
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4)
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(3)
}));

const StyledSpecsList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  '& .MuiListItemText-root': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
  }
}));

const StyledProductImage = styled(CardMedia)(({ theme }) => ({
  height: '200px',
  borderRadius: '12px',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromQuery = searchParams.get('category') || 'all';
  const searchTermFromQuery = searchParams.get('search') || '';

  const [configSelections, setConfigSelections] = useState({});

  const handleConfigChange = (productId, field, value) => {
    setConfigSelections(prev => {
      const prevConfig = prev[productId] || {};
      return {
        ...prev,
        [productId]: {
          ...prevConfig,
          [field]: value
        }
      };
    });
  };

  const [searchTerm, setSearchTerm] = useState(searchTermFromQuery || '');
  const [activeCategory, setActiveCategory] = useState(categoryFromQuery || 'all');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [zoomImgIdx, setZoomImgIdx] = useState(null);
  const { addToCart } = useCart();
  const theme = useTheme();


  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (zoomImgIdx === null || !selectedProduct || !selectedProduct.images) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setZoomImgIdx(idx => (idx - 1 + selectedProduct.images.length) % selectedProduct.images.length);
      } else if (e.key === 'ArrowRight') {
        setZoomImgIdx(idx => (idx + 1) % selectedProduct.images.length);
      } else if (e.key === 'Escape') {
        setZoomImgIdx(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomImgIdx, selectedProduct]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Products data is managed via state
  const [productsByCategory] = useState({
    laptops: [
      {
        id: 1,
        name: "Apple MacBook Air M4 14inch (Refurbished)",
        brand: "Apple",
        model: "M4 Air",
        description: "14-inch Retina display, M4 chip, 16GB RAM, 256GB SSD",
        price: 82000,
        category: "laptops",
        condition: "new",
        image: '/images/Apple m4 air.jpeg',
        images: [
          '/images/Apple m4 air.jpeg',
          '/images/M4 air (2).jpg',
          '/images/M4 air (3).jpg',
          '/images/M4 air (4).jpg',
        ],
        rating: 4.7,
        specs: {
          processor: "Apple M4",
          ram: "16GB Unified Memory",
          storage: "256GB SSD",
          display: "14-inch Retina display",
          graphics: "Apple M4 graphics",
          battery: "Up to 18 hours",
          weight: "2.8 pounds",
          color: "Space Gray"
        }
      },
      {
        id: 2,
        name: "Apple MacBook pro A1989 with Touch Bar (Refurbished)",
        brand: "Apple",
        model: "A1989",
        description: "16-inch Retina display, Intel Core i5, 8GB RAM, 256GB SSD",
        price: 21500,
        category: "laptops",
        condition: "new",
        image: '/images/A1989.jpg',
        images: [
          '/images/A1989.jpg',
          '/images/A1989 (1).jpg',
          '/images/A1989 (2).jpg',
          '/images/A1989 (3).jpg',
        ],
        rating: 4.5,
        specs: {
          processor: "Intel Core i5",
          ram: "8GB",
          storage: "256GB SSD",
          display: "16-inch Retina display",
          graphics: "Intel Iris Plus Graphics 645",
          battery: "Up to 10 hours",
          weight: "4.3 pounds",
          color: "Space Gray"
        }
      },
      {
        id: 3,
        name: "Apple MacBook pro M1 (2021) (Refurbished)",
        brand: "Apple",
        model: "M1 Pro",
        description: "16-inch Retina display, M1 chip, 32GB RAM, 512GB SSD",
        price: 84000,
        category: "laptops",
        condition: "new,used",
        image: '/images/m1 pro 16inch.jpg',
        images: [
          '/images/m1 pro 16inch.jpg',
          '/images/M1 pro (3).jpg',
        ],
        rating: 4.8,
        specs: {
          processor: "Apple M1",
          ram: "32GB RAM",
          storage: "512GB SSD",
          display: "16-inch Retina display",
          graphics: "Apple M1 graphics",
          battery: "Up to 21 hours",
          weight: "3.5 pounds",
          color: "Silver"
        }
      },
      {
        id: 4,
        name: "Apple MacBook M3 Pro (Refurbished)",
        brand: "Apple",
        model: "M3 Pro",
        description: "16-inch Retina display, M3 chip, 18GB RAM, 512GB SSD",
        price: 84000,
        category: "laptops",
        condition: "new",
        image: '/images/M3 pro.png',
        images: [
          '/images/M3 pro.png',
          '/images/M3 pro (2).jpg',
          '/images/M3 pro (3).jpg'
        ],
        rating: 4.8,
        specs: {
          processor: "Apple M3",
          ram: "18GB RAM",
          storage: "512GB SSD",
          display: "16-inch Retina display",
          graphics: "Apple M3 graphics",
          battery: "Up to 21 hours",
          weight: "3.5 pounds",
          color: "Silver"
        }
      },
      {
        id: 5,
        name: "Dell latitude 5420 (Refurbished)",
        brand: "Dell",
        model: "5420",
        description: "15.6-inch 360Hz display, Intel Core i7, 11th gen, 16GB RAM, 512GB SSD, with Touchpad",
        price: 21500,
        category: "laptops",
        condition: "new",
        image: '/images/Dell 5420.jpg',
        rating: 4.9,
        specs: {
          processor: "Intel Core i7",
          ram: "16GB RAM",
          storage: "512GB SSD",
          display: "15.6-inch 360Hz display",
          graphics: "Integrated Intel Graphics",
          battery: "Up to 8 hours",
          weight: "4.3 pounds",
          color: "Obsidian Black"
        }
      },
      {
        id: 6,
        name: "Lenovo L460 (Refurbished)",
        brand: "Lenovo",
        model: "L460",
        description: "15.6-inch 360Hz display, Intel Core i5, 6th gen, 8GB RAM, 512GB SSD",
        price: 11500,
        category: "laptops",
        condition: "new",
        image: '/images/Lenovo L460.jpg',
        rating: 4.9,
        specs: {
          processor: "Intel Core i7",
          ram: "16GB RAM",
          storage: "512GB SSD",
          display: "15.6-inch 360Hz display",
          graphics: "Integrated Intel Graphics",
          battery: "Up to 8 hours",
          weight: "4.3 pounds",
          color: "Obsidian Black"
        }
      },
      {
        id: 7,
        name: "Lenovo X1 Yoga (Refurbished)",
        brand: "Lenovo",
        model: "X1 Yoga",
        description: "14-inch 360Hz display, Intel Core i7, 8th gen, 16GB RAM, 256GB NVMe SSD",
        price: 20000,
        category: "laptops",
        condition: "new",
        image: '/images/X1 yoga.jpg',
        rating: 4.9,
        specs: {
          processor: "Intel Core i7",
          ram: "16GB RAM",
          storage: "256GB NVMe SSD",
          display: "15.6-inch 360Hz display",
          graphics: "Integrated Intel Graphics",
          battery: "Up to 8 hours",
          weight: "4.3 pounds",
          color: "Obsidian Black"
        }
      },
      {
        id: 8,
        name: "Lenovo X1 Carbon (Refurbished)",
        brand: "Lenovo",
        model: "X1 Carbon",
        description: "14-inch 360Hz display, Intel Core i7, 7th gen, 16GB RAM, 256GB NVMe SSD",
        price: 13000,
        category: "laptops",
        condition: "new",
        image: '/images/X1 carbon.jpg',
        rating: 4.9,
        configOptions: {
          processor: [
            { value: 'i7', label: 'Intel Core i7 7th Gen', },
            { value: 'i7', label: 'Intel Core i7 8th Gen', price: 1000 }
          ]
        },
        specs: {
          processor: "Intel Core i7",
          ram: "16GB RAM",
          storage: "256GB NVMe SSD",
          display: "14-inch 360Hz display",
          graphics: "Integrated Intel Graphics",
          battery: "Up to 8 hours",
          weight: "4.3 pounds",
          color: "Obsidian Black"
        }
      },
      {
        id: 9,
        name: "Dell Latitude 3420 (Refurbished)",
        brand: "Dell",
        model: "Latitude 3420",
        description: "14-inch 360Hz display, Intel Core i5, 11th gen, 8GB RAM, 256GB SSD",
        price: 18000,
        category: "laptops",
        condition: "new",
        image: '/images/Dell 3420 (1).jpg',
        images: [
          '/images/Dell 3420 (1).jpg',
          '/images/Dell 3420 (2).jpg',
          '/images/Dell 3420 (3).png',
        ],
        rating: 4.9,
        specs: {
          processor: "Intel Core i5",
          ram: "8GB RAM",
          storage: "256GB SSD",
          display: "14-inch 360Hz display",
          graphics: "Integrated Intel Graphics",
          battery: "Up to 8 hours",
          weight: "4.3 pounds",
          color: "Obsidian Black"
        }
      },
      {
        id: 10,
        name: "HP EliteBook 440 G8 (Refurbished)",
        brand: "HP",
        model: "EliteBook 440 G8",
        description: "14-inch 360Hz display, Intel Core i5, 11th gen, 8GB RAM, 256GB NVMe SSD",
        price: 18000,
        category: "laptops",
        condition: "new",
        image: '/images/HP 440 G8.jpg',
        rating: 4.9,
        specs: {
          processor: "Intel Core i5",
          ram: "8GB RAM",
          storage: "256GB NVMe SSD",
          display: "14-inch 360Hz display",
          graphics: "Integrated Intel Graphics",
          battery: "Up to 8 hours",
          weight: "4.3 pounds",
          color: "Obsidian Black"
        }
      },
      {
        id: 11,
        name: "HP Pavilion 15 (Refurbished)",
        brand: "HP",
        model: "Pavilion 15",
        description: "15.6-inch 360Hz display, Intel Core i5, 7th gen, 16GB RAM, 512GB SSD, Backlit Keyboard",
        price: 22500,
        category: "laptops",
        condition: "new",
        image: '/images/Pavilion i5.jpg',
        rating: 4.9,
        specs: {
          processor: "Intel Core i5",
          ram: "16GB RAM",
          storage: "512GB SSD",
          display: "15.6-inch 360Hz display",
          graphics: "4GB NVIDIA Graphics",
          battery: "Up to 8 hours",
          weight: "4.3 pounds",
          color: "Obsidian Black"
        }
      },
      {
        id: 12,
        name: "HP Pavilion gaming 15",
        brand: "HP",
        model: "Pavilion 15",
        description: "15.6-inch 360Hz display, AMD Ryzen 5 4600H, 7th gen, 16GB RAM, 512GB SSD, Backlit Keyboard",
        price: 24500,
        category: "laptops",
        condition: "new",
        image: '/images/HP amd 5.jpg',
        rating: 4.9,
        specs: {
          processor: "AMD Ryzen 5",
          ram: "16GB RAM",
          storage: "512GB SSD",
          display: "15.6-inch 360Hz display",
          graphics: "4GB NVIDIA Graphics",
          battery: "Up to 8 hours",
          weight: "4.3 pounds",
          color: "Obsidian Black"
        }
      },
      {
        id: 13,
        name: "Dell Latitude 5410",
        brand: "Dell",
        model: "Latitude 5410",
        description: "14-inch FHD display, Intel Core i7, 10th gen, 8GB RAM, 256GB SSD",
        price: 24500,
        category: "laptops",
        condition: "new",
        image: '/images/Dell 5410.jpg',
        rating: 4.9,
        specs: {
          processor: "Intel Core i7",
          ram: "8GB RAM",
          storage: "256GB SSD",
          display: "14-inch FHD display",
          graphics: "Integrated Intel Graphics",
          battery: "Up to 8 hours",
          weight: "4.3 pounds",
          color: "Obsidian Black"
        }
      },
      {
        id: 14,
        name: "Dell Latitude 7490",
        brand: "Dell",
        model: "Latitude 7490",
        description: "14-inch FHD display, Intel Core i7, 8th gen, 8GB RAM, 256GB SSD",
        price: 24500,
        category: "laptops",
        condition: "new",
        image: '/images/Dell 7490.jpg',
        rating: 4.9,
        specs: {
          processor: "Intel Core i7",
          ram: "8GB RAM",
          storage: "256GB SSD",
          display: "14-inch FHD display",
          graphics: "Integrated Intel Graphics",
          battery: "Up to 8 hours",
          weight: "4.3 pounds",
          color: "Obsidian Black"
        }
      },
      {
        id: 15,
        name: "Apple MacBook M2 Pro",
        brand: "Apple",
        model: "M2 Pro",
        description: "16-inch Retina display, M2 Pro chip, 32GB RAM, 512GB SSD",
        price: 82000,
        category: "laptops",
        condition: "new",
        image: '/images/m2 pro (1).jpg',
        images: [
          '/images/m2 pro (1).jpg',
          '/images/m2 pro (2).jpg',
          '/images/m2 pro (3).jpg',
        ],
        rating: 4.7,
        specs: {
          processor: "Apple M2 Pro",
          ram: "32GB Unified Memory",
          storage: "512GB SSD",
          display: "16-inch Retina display",
          graphics: "12-Core CPU + 19-Core GPU",
          battery: "Up to 18 hours",
          weight: "2.8 pounds",
          color: "Space Gray"
        }
      },
      {
        id: 16,
        name: "Apple MacBook Pro A2251",
        brand: "Apple",
        model: "Pro A2251",
        description: "13.3-inch Retina display, 16GB RAM, 512GB SSD",
        price: 33000,
        category: "laptops",
        condition: "used",
        image: '/images/A2251 (1).png',
        images: [
          '/images/A2251 (2).jpg',
          '/images/A2251 (3).jpg',
          '/images/A2251 (4).jpg',
          '/images/A2251 (5).jpg'
        ],
        rating: 4.7,
        specs: {
          processor: "Intel Core i5-1038NG7 , Intel Core i7-1068NG7	",
          ram: "16GB Unified Memory",
          storage: "512GB SSD",
          display: "13.3-inch Retina display",
          graphics: "12-Core CPU + 19-Core GPU",
          battery: "Up to 18 hours",
          weight: "2.8 pounds",
          color: "Space Gray"
        }
      },
      {
        id: 17,
        name: "Dell Latitude 3510",
        brand: "Dell",
        model: "Latitude 3510",
        description: "15.6-inch Retina display, 16GB RAM, 512GB SSD",
        price: 14500,
        category: "laptops",
        condition: "used",
        image: '/images/Dell 3510 (1).jpg',
        images: [
          '/images/Dell 3510 (1).jpg',
          '/images/Dell 3510 (2).jpg',
        ],
        rating: 4.7,
        specs: {
          processor: "Intel Core i5-10210U (4C/8T, up to 4.2GHz)",
          ram: "4GB / 8GB / 16GB DDR4, 2666MHz (upgradeable up to 32GB)",
          storage: "256GB / 512GB / 1TB SSD (PCIe NVMe)",
          display: "15.6 Anti-glare LED-backlit screen",
          graphics: "Integrated Intel UHD Graphics (i3) / Intel Iris Plus (i5/i7 variants)",
          battery: "Up to 18 hours",
          weight: "Approx. 1.91 kg (4.2 lbs)",
          color: "Dark Gray / Black matte textured finish"
        }
      },
      {
        id: 18,
        name: "Dell Latitude 3520",
        brand: "Dell",
        model: "Latitude 3520",
        description: "15.6-inch Retina display, 8GB RAM, 256GB SSD",
        price: 15500,
        category: "laptops",
        condition: "used",
        image: '/images/Dell 3520 (1).jpg',
        images: [
          '/images/Dell 3520 (1).jpg',
          '/images/Dell 3520 (3).jpg',
          '/images/Dell 3520 (4).jpg',
        ],
        rating: 4.7,
        specs: {
          processor: "Intel Core i5-10210U (4C/8T, up to 4.2GHz)",
          ram: "4GB / 8GB / 16GB DDR4, 2666MHz (upgradeable up to 32GB)",
          storage: "256GB / 512GB / 1TB SSD (PCIe NVMe)",
          display: "15.6 Anti-glare LED-backlit screen",
          graphics: "Integrated Intel UHD Graphics (i3) / Intel Iris Plus (i5/i7 variants)",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Dark Gray / Black matte textured finish"
        }
      },
      {
        id: 19,
        name: "Dell Latitude 3410",
        brand: "Dell",
        model: "Latitude 3410",
        description: "15.6-inch Retina display, 8GB RAM, 256GB SSD",
        price: 14000,
        category: "laptops",
        condition: "used",
        image: '/images/Dell 3410 (1).jpg',
        images: [
          '/images/Dell 3410 (1).jpg',
          '/images/Dell 3410 (2).jpg',
          '/images/Dell 3410 (4).jpg',
        ],
        rating: 4.7,
        specs: {
          processor: "Intel Core i5-10210U (4C/8T, up to 4.2GHz)",
          ram: "4GB / 8GB / 16GB DDR4, 2666MHz (upgradeable up to 32GB)",
          storage: "256GB / 512GB / 1TB SSD (PCIe NVMe)",
          display: "14-inch FHD display",
          graphics: "Integrated Intel UHD Graphics (i3) / Intel Iris Plus (i5/i7 variants)",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Dark Gray / Black matte textured finish"
        }
      },
      {
        id: 20,
        name: "Dell Latitude 7410",
        brand: "Dell",
        model: "Latitude 7410",
        description: "15.6-inch Retina display, 8GB RAM, 256GB SSD",
        price: 17000,
        category: "laptops",
        condition: "used",
        image: '/images/Dell 7410 (1).jpg',
        images: [
          '/images/Dell 7410 (1).jpg',
          '/images/Dell 7410 (2).jpg',
          '/images/Dell 7410 (3).jpg',
        ],
        rating: 4.7,
        specs: {
          processor: "Intel Core i7-1068NG7",
          ram: "8GB / 16GB DDR4, 2666MHz (upgradeable up to 32GB)",
          storage: "256GB / 512GB / 1TB SSD (PCIe NVMe)",
          display: "15.6-inch Retina display",
          graphics: "Intel UHD integrated graphics",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Dark Gray / Black matte textured finish"
        }
      },
      {
        id: 21,
        name: "Dell Latitude 3400",
        brand: "Dell",
        model: "Latitude 3400",
        description: "15.6-inch Retina display, 8GB RAM, 256GB SSD",
        price: 11500,
        category: "laptops",
        condition: "used",
        image: '/images/Dell 3400 (1).jpg',
        images: [
          '/images/Dell 3400 (1).jpg',
          '/images/Dell 3400 (2).jpg',
          '/images/Dell 3400 (3).png',
        ],
        rating: 4,
        configOptions: {
          processor: [
            { value: 'i5', label: 'Intel Core i5 8th Gen', },
            { value: 'i7', label: 'Intel Core i7 8th Gen', price: 1000 }
          ]
        },
        specs: {
          processor: "Intel Core i5 - 8th Gen",
          ram: "8GB / 16GB DDR4, 2666MHz (upgradeable up to 32GB)",
          storage: "256GB / 512GB / 1TB SSD (PCIe NVMe)",
          display: "15.6-inch Retina display",
          graphics: "Intel UHD integrated graphics",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Dark Gray / Black matte textured finish"
        }
      },
      {
        id: 21,
        name: "Dell Latitude 3301",
        brand: "Dell",
        model: "Latitude 3301",
        description: "13.3-inch Full HD display, 8GB RAM, 256GB SSD",
        price: 12000,
        category: "laptops",
        condition: "used",
        image: '/images/Dell 3301 (3).jpg',
        images: [
          '/images/Dell 3301 (1).jpg',
          '/images/Dell 3301 (2).jpg',
          '/images/Dell 3301 (3).jpg',
          '/images/Dell 3301 (4).jpg',
        ],
        rating: 4,
        configOptions: {
          processor: [
            { value: 'i5', label: 'Intel Core i5 8th Gen', },
            { value: 'i7', label: 'Intel Core i7 8th Gen', price: 1000 }
          ]
        },
        specs: {
          processor: "Intel Core i5 - 8th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "13.3-inch Full HD display",
          graphics: "Intel UHD 620",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Dark Gray / Black matte textured finish"
        }
      },
      {
        id: 22,
        name: "Lenovo X1",
        brand: "Lenovo",
        model: "X1",
        description: "14-inch Full HD display, 8GB RAM, 256GB SSD",
        price: 16000,
        category: "laptops",
        condition: "used",
        image: '/images/Lenovo x1 (1).jpeg',
        images: [
          '/images/Lenovo x1 (1).jpeg',
          '/images/Lenovo x1 (2).jpg',
          '/images/Lenovo x1 (3).jpg',
        ],
        rating: 4,
        specs: {
          processor: "Intel Core i7 - 10th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "14-inch IPS display",
          graphics: "Intel UHD 620",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Dark Gray / Black matte textured finish"
        }
      },
      {
        id: 23,
        name: "Lenovo P14 S Touch Screen",
        brand: "Lenovo",
        model: "P14 S",
        description: "14-inch QHD 4K display, 8GB RAM, 256GB SSD",
        price: 17500,
        category: "laptops",
        condition: "used",
        image: '/images/Lenovo p14.jpg',
        images: [
          '/images/Lenovo p14.jpg',
          '/images/Lenovo p14 (2).jpg',
          '/images/Lenovo p14 (3).jpg',
          '/images/Lenovo p14 (4).jpg',
        ],
        rating: 4,
        specs: {
          processor: "Intel Core i7 - 10th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "FHD (14″), QHD 4K",
          graphics: "Intel UHD 620",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Dark Gray / Black matte textured finish"
        }
      },
      {
        id: 24,
        name: "Lenovo P43 S",
        brand: "Lenovo",
        model: "P43 S",
        description: "14-inch FHD display, 8GB RAM, 256GB SSD",
        price: 15000,
        category: "laptops",
        condition: "used",
        image: '/images/Lenovo p43 (1).jpg',
        images: [
          '/images/Lenovo p43 (1).jpg',
          '/images/Lenovo p43 (2).jpg',
          '/images/Lenovo p43 (3).jpg',
          '/images/Lenovo p43 (4).jpg',
        ],
        rating: 4,
        specs: {
          processor: "Intel Core i7 - 8th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "FHD (14″), QHD 4K",
          graphics: "Intel UHD 620",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Dark Gray / Black matte textured finish"
        }
      },
      {
        id: "64f9c0ab1f5b2b7d12345688",
        name: "Lenovo ThinkPad T14 (Gen 1) (Refurbished)",
        brand: "Lenovo",
        model: "ThinkPad T14 (Gen 1)",
        description: "14-inch FHD display, 8GB RAM, 256GB SSD",
        price: 14000,
        category: "laptops",
        condition: "used",
        image: '/images/lenovo t14 (1).jpg',
        images: [
          '/images/lenovo t14 (1).jpg',
          '/images/Lenovo t14 (2).jpg',
          '/images/Lenovo t14 (3).jpg',
        ],
        rating: 4,
        specs: {
          processor: "Intel Core i5 - 10th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "FHD (14″), QHD 4K",
          graphics: "Intel UHD 620",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Dark Gray / Black matte textured finish"
        }
      },
      {
        id: "64f9c0ab1f5b2b7d12345689",
        name: "HP EliteBook 840 G7 (Refurbished)",
        brand: "HP",
        model: "EliteBook 840 G7",
        description: "14-inch FHD display, 8GB RAM, 256GB SSD",
        price: 20500,
        category: "laptops",
        condition: "used",
        configOptions: {
          processor: [
            { value: 'i5', label: 'Intel Core i5 10th Gen', },
            { value: 'i7', label: 'Intel Core i7 10th Gen', price: 1500 }
          ]
        },
        image: '/images/Hp 840 (1).jpg',
        images: [
          '/images/Hp 840 (1).jpg',
          '/images/Hp 840 (2).jpg',
          '/images/Hp 840 (3).jpg',
          '/images/Hp 840 (4).jpg',
        ],
        rating: 4,
        specs: {
          processor: "Intel Core i5 - 10th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "FHD (14″), QHD 4K",
          graphics: "Intel UHD 620",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Silver magnesium/aluminum chassis; sleek business finish"
        }
      },
      {
        id: "64f9c0ab1f5b2b7d1234568a",
        name: "HP EliteBook 850 G5 Touch Screen (Refurbished)",
        brand: "HP",
        model: "EliteBook 850 G5",
        description: "15.6-inch 4K UHD display, 8GB RAM, 256GB SSD",
        price: 15000,
        category: "laptops",
        condition: "used",
        image: '/images/Hp 850 (1).jpg',
        images: [
          '/images/Hp 850 (1).jpg',
          '/images/Hp 850 (2).jpg',
        ],
        rating: 4,
        specs: {
          processor: "Intel Core i5 - 8th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "FHD (14″), QHD 4K",
          graphics: "Intel UHD 620",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Silver magnesium/aluminum chassis; sleek business finish"
        }
      },
      {
        id: "64f9c0ab1f5b2b7d1234568b",
        name: "HP EliteBook Folio 1040 G3 (Refurbished)",
        brand: "HP",
        model: "EliteBook Folio 1040 G3",
        description: "14-inch FHD display, 8GB RAM, 256GB SSD",
        price: 14000,
        category: "laptops",
        condition: "used",
        image: '/images/Hp 1040 (1).jpg',
        images: [
          '/images/Hp 1040 (1).jpg',
          '/images/Hp 1040 (2).jpg',
        ],
        rating: 4,
        specs: {
          processor: "Intel Core i7 - 6th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "FHD (14″), QHD 4K",
          graphics: "Intel UHD 520",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Silver aluminum unibody, meets MIL‑STD 810G"
        }
      },
      {
        id: "64f9c0ab1f5b2b7d1234568c",
        name: "HP EliteBook Folio 9480m (Refurbished)",
        brand: "HP",
        model: "EliteBook Folio 9480m",
        description: "14″ LED-backlit screen, 8GB RAM, 256GB SSD",
        price: 7500,
        category: "laptops",
        condition: "used",
        image: '/images/Hp 9840 (1).jpg',
        images: [
          '/images/Hp 9840 (1).jpg',
          '/images/Hp 9840 (2).jpg',
          '/images/Hp 9840 (3).jpg',
        ],
        rating: 4,
        specs: {
          processor: "Intel Core i7 - 4th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "14-inch LED-backlit screen",
          graphics: "Intel UHD 520",
          battery: "Up to 18 hours",
          weight: "~1.78–1.79 kg (3.92 lb) with adapter ≈310 g",
          color: "Silver aluminum unibody, meets MIL‑STD 810G"
        }
      },
    ],
    accessories: [
      {
        id: "64f9c0ab1f5b2b7d1234568d",
        name: "FRONTECH KB-0014 Black Wired Gaming Mechanical Keyboard",
        brand: "FRONTECH",
        model: "KB-0014",
        description: "A captivating game styling with cool and attractive RGB light effects, creating a bright and diverse visual experience.",
        price: 1999,
        category: "accessories",
        condition: "new",
        image: '/images/KB 0014 (1).jpg',
        images: ['/images/KB 0014 (1).jpg',
           '/images/KB 0014 (2).jpg',
            '/images/KB 0014 (3).jpg',
             '/images/KB 0014 (4).jpg',
             '/images/KB 0014 (5).jpg'],
        rating: 4.6,
        specs: {
          Type: "Wired",
          Connectivity: "USB",
          Color: "Black",
         
          Weight: "423g"
        }
      },
      {
        id: 102,
        name: "Dell KB216 Wired Multimedia Keyboard",
        Brand: "Dell",
        Model: "KB216",
        Description: "Full-Size Layout with USB Interface, Chiclet Keys, Spill Resistance with 3 Indicator Lights.",
        price: 1299,
        Category: "accessories",
        Condition: "new",
        image: '/images/KB 216 (1).jpg',
        images: ['/images/KB 216 (1).jpg',
        '/images/KB 216 (2).jpg',
        '/images/KB 216 (3).jpg',
        '/images/KB 216 (4).jpg'],
        rating: 4.3,
        specs: {
          Type: "Wired",
          Connectivity: "USB",
          Color: "Black",
          Weight: "678g"
        }
      },
      {
        id: 103,
        name: "Intex Corona G Keyboard",
        brand: "Intex",
        model: "Corona G",
        description: "With a 1.2 m elongated wire length, this premium wired keyboard with plug and play is your ideal choice. It has a whopping 80 lac click button cycle.",
        price: 799,
        category: "accessories",
        condition: "new",
        image: '/images/CORONA (1).jpg',
        images: ['/images/CORONA (1).jpg',
        '/images/CORONA (2).jpg',
        '/images/CORONA (3).jpg',
        '/images/CORONA (4).jpg',
        '/images/CORONA (5).jpg',
      ],
        rating: 4.5,
        specs: {
          type: "Wired",
          connectivity: "USB Receiver",
          color: "Black",
          weight: "75.2g"
        }
      },
      {
        id: 104,
        name: "Frontech Wired Keyboard KB-0047",
        brand: "Frontech",
        model: "KB-0047",
        description: "Its sleek black design features a waterproof build and a lightweight yet sturdy construction, and it offers a USB Plug and Play connection",
        price: 399,
        category: "accessories",
        condition: "new",
        image: '/images/KB 0047 (1).jpg',
        images: ['/images/KB 0047 (1).jpg',
          '/images/KB 0047 (2).jpg',
          '/images/KB 0047 (3).jpg',
          '/images/KB 0047 (4).jpg',
          '/images/KB 0047 (5).jpg',
        ],
        rating: 4.2,
        specs: {
          type: "Wired",
          connectivity: "USB",
          color: "Black",
          dpi: "1000",
          weight: "90g"
        }
      },
      {
        id: 105,
        name: "ZEBRONICS Nitro Plus Mechanical Keyboard",
        brand: "ZEBRONICS",
        model: "Nitro Plus",
        description: "The Nitro Plus Mechanical Keyboard is a premium mechanical keyboard that offers a comfortable and durable typing experience. It features a compact and lightweight design, with a 104-key layout and a 1.35-meter cable for easy positioning. The keyboard is made of high-quality materials and is designed to be durable and long-lasting. It also includes a 1-year warranty and a 30-day money-back guarantee.",
        price: 1499,
        category: "accessories",
        condition: "new",
        image: '/images/NITRO (1).jpg',
        images: ['/images/NITRO (1).jpg',
          '/images/NITRO (2).jpg',
          '/images/NITRO (3).jpg',
          '/images/NITRO (4).jpg',
          '/images/NITRO (5).jpg',
          '/images/NITRO (6).jpg',
          '/images/NITRO (7).jpg',
        ],
        rating: 4.4,
        specs: {
          type: "Wired",
          connectivity: "USB",
          color: "Luscious Black",
          light: "RGB",
          weight: "168g"
        }
      },
      {
        id: 106,
        name: "Zebronics Transformer Gaming Keyboard and Mouse Combo",
        brand: "Zebronics",
        model: "Transformer 1",
        description: "Zebronics Transformer Gaming Keyboard and Mouse Combo,Braided Cable,Durable Al body,Multimedia keys and Gaming Mouse with 6 Buttons, Multi-Color LED Lights, High-Resolution Sensor with 3200 DPI.",
        price: 599,
        category: "accessories",
        condition: "new",
        image: '/images/Trans 1.jpg',
        images: ['/images/Trans 1.jpg',
          '/images/Trans 2.jpg',
          '/images/Trans 3.jpg',
          '/images/Trans 4.jpg',
          '/images/Trans 5.jpg',
          '/images/Trans 6.jpg',
          '/images/Trans 7.jpg',
          '/images/trans_white 1.jpg',
          '/images/trans_white 2.jpg',
          '/images/trans_white 3.jpg',
          '/images/trans_white 4.jpg',
          '/images/trans_white 5.jpg',
          '/images/trans_white 6.jpg',
          '/images/trans_white 7.jpg',
        ],
       
        rating: 4.1,
        specs: {
          type: "Wired",
          connectivity: "USB",
          color: "Black",
          weight: "50g"
        }
      },
      {
        id: 106,
        name: "Dell Keyboard and Mouse - KM3322W - US International",
        brand: "Dell",
        model: "KM3322W",
        description: "The KM3322W is a premium mechanical keyboard and mouse that offers a comfortable and durable typing experience. It features a compact and lightweight design, with a 104-key layout and a 1.35-meter cable for easy positioning. The keyboard is made of high-quality materials and is designed to be durable and long-lasting. It also includes a 1-year warranty and a 30-day money-back guarantee.",
        price: 1499,
        category: "accessories",
        condition: "new",
        image: '/images/Dell KM 1.jpg',
        images: ['/images/Dell KM 1.jpg',
          '/images/Dell KM 2.jpg',
          '/images/Dell KM 3.jpg',
          '/images/Dell KM 4.jpg',
           ],
        rating: 4.4,
        specs: {
          type: "Wired",
          connectivity: "USB",
          color: "Luscious Black",
         
          weight: "168g"
        }
      },
      {
        id: 107,
        name: "Logitech G Pro X Superlight",
        brand: "Logitech",
        model: "G Pro X Superlight",
        description: "The KM3322W is a premium mechanical keyboard and mouse that offers a comfortable and durable typing experience. It features a compact and lightweight design, with a 104-key layout and a 1.35-meter cable for easy positioning. The keyboard is made of high-quality materials and is designed to be durable and long-lasting. It also includes a 1-year warranty and a 30-day money-back guarantee.",
        price: 1499,
        category: "accessories",
        condition: "new",
        image: '/images/Dell KM 1.jpg',
        images: ['/images/Dell KM 1.jpg',
          '/images/Dell KM 2.jpg',
          '/images/Dell KM 3.jpg',
          '/images/Dell KM 4.jpg'
        ],
        rating: 4.4,
        specs: {
          type: "Wired",
          connectivity: "USB",
          color: "Luscious Black"
        }
      }
    ]
  });

  // Get search term from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    if (search) {
      setSearchTerm(search);
    }
    if (category) {
      setActiveCategory(category);
    }
  }, [location.search]);

  // Get all products from all categories
  const allProducts = React.useMemo(() => {
    return Object.values(productsByCategory).flat();
  }, [productsByCategory]);

  // Filter products based on category
  const filteredProducts = React.useMemo(() => {
    if (!productsByCategory) return [];
    return activeCategory !== 'all' 
      ? productsByCategory[activeCategory] || []
      : allProducts;
  }, [activeCategory, productsByCategory, allProducts]);

  // Filter by search term
  const searchFilteredProducts = React.useMemo(() => {
    if (!filteredProducts) return [];
    return filteredProducts.filter(product => 
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredProducts, searchTerm]);

  // Filter by condition
  const conditionFilteredProducts = React.useMemo(() => 
    searchFilteredProducts.filter(product => 
      selectedCondition === 'all' || product.condition === selectedCondition
    ),
    [searchFilteredProducts, selectedCondition]
  );

  // Get search suggestions
  useEffect(() => {
    if (searchTerm.length > 1) {
      const suggestions = filteredProducts
        .filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(product => product.name)
        .slice(0, 5);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm, filteredProducts]);

  
  return (
    <Box sx={{ minHeight: '100vh', background: '#23272f' }}>
      {/* Laptops Promo/Deal Strip at the very top, full width */}
      {activeCategory === 'laptops' && (
        <Box sx={{
          background: 'linear-gradient(90deg,#e0f2fe 60%,#e6f6f3 100%)',
          color: '#17436b',
          borderRadius: 0,
          py: 1.5,
          px: 3,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '1.07rem',
          boxShadow: '0 1px 8px #2563eb11',
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          zIndex: 2
        }}>
          🎉 Today’s Deal: <span style={{ color: '#10b981', margin: '0 8px', fontWeight: 700 }}>Up to 20% OFF</span> on select laptops! &nbsp; | &nbsp; <span style={{ color: '#2563eb' }}>Free Shipping </span>  on orders over ₹25,000
        </Box>
      )}

      {/* Hero Banner: now shown for all categories and search */}
      {activeCategory === 'laptops' ? (
        <Fade in={true} timeout={1100}>
          <Box sx={{
            background: 'linear-gradient(90deg, #e3edf7 60%, #e6f6f3 100%)',
            color: '#17436b',
            borderRadius: 4,
            p: { xs: 3, md: 6 },
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: { xs: 220, md: 260 },
            boxShadow: '0 4px 24px 0 rgba(36,81,171,0.07)'
          }}>
            <Box sx={{ flex: 1, zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: 1, color: '#17436b' }}>
                Find Your Perfect Laptop
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: '#426b8c' }}>
                Explore the latest laptops from top brands. Subtle style, expert support, and great prices.
              </Typography>
              <Button variant="contained" size="large" sx={{ mt: 1, fontWeight: 700, background: '#2563eb', color: '#fff', boxShadow: '0 2px 8px #2563eb22', borderRadius: 2, '&:hover': { background: '#17436b' } }} onClick={() => window.scrollTo({top: 400, behavior: 'smooth'})}>
                Shop Laptops
              </Button>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 0 }}>
              <span style={{ fontSize: 180, color: '#2563eb', filter: 'drop-shadow(0 8px 24px #2563eb22)' }}>💻</span>
            </Box>
          </Box>
        </Fade>
      ) : (
        <Fade in={true} timeout={1100}>
          <Box sx={{
            background: 'linear-gradient(90deg,#23272f 60%,#393e46 100%)',
            color: '#fff',
            borderRadius: 4,
            p: { xs: 3, md: 6 },
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: { xs: 220, md: 280 }
          }}>
            <Box sx={{ flex: 1, zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: 1 }}>
                Find Your Perfect Product
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: '#e0f7fa' }}>
                Explore the latest models from top brands. Unbeatable prices, expert support, and fast delivery.
              </Typography>
              <Button variant="contained" size="large" sx={{ mt: 1, fontWeight: 700, background: 'rgba(0,0,0,0.15)' }} onClick={() => window.scrollTo({top: 400, behavior: 'smooth'})}>
                Shop Now
              </Button>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 0 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png" alt="Hero" style={{ width: 200, height: 140, filter: 'drop-shadow(0 8px 32px #0008)' }} />
            </Box>
            <Box sx={{ position: 'absolute', right: -80, top: -40, opacity: 0.08, zIndex: 0 }}>
              <span style={{ fontSize: 220, color: '#fff' }}>★</span>
            </Box>
          </Box>
        </Fade>
      )}

      {activeCategory === 'laptops' && (
        <Fade in={true} timeout={1300}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, mb: 4, background: '#e0f2fe', borderRadius: 3, py: 2, boxShadow: '0 2px 12px 0 rgba(36,81,171,0.05)' }}>
            <Box sx={{ minWidth: 120, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#2563eb' }}>100+</Typography>
              <Typography variant="body2" sx={{ color: '#17436b' }}>Models</Typography>
            </Box>
            <Box sx={{ minWidth: 120, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>Top</Typography>
              <Typography variant="body2" sx={{ color: '#17436b' }}>Brands</Typography>
            </Box>
            <Box sx={{ minWidth: 120, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#2563eb' }}>Expert</Typography>
              <Typography variant="body2" sx={{ color: '#17436b' }}>Support</Typography>
            </Box>
            <Box sx={{ minWidth: 120, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>Best</Typography>
              <Typography variant="body2" sx={{ color: '#17436b' }}>Prices</Typography>
            </Box>
          </Box>
        </Fade>
      )}

      {/* E-commerce elements for laptops: Featured Brands Bar */}
      {activeCategory === 'laptops' && (
        <Box sx={{ background: '#23272f', borderRadius: 2, py: 2, px: 2, mb: 3, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          {[
            '/images/Dell Logo.png',
            '/images/HP Logo.png',
            '/images/Apple Logo.png',
            '/images/ASUS Logo.png',
            '/images/Acer Logo.png'
          ].map((src, i) => (
            <Box key={i} sx={{ p: 1, borderRadius: 2, background: '#fff', boxShadow: '0 1px 4px #11182722', border: '1px solid #23272f', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 2px 12px #2563eb22', background: '#e3edf7' } }}>
              <img src={src} alt="Brand" style={{ height: 36, width: 'auto', objectFit: 'contain', filter: 'grayscale(0.2)' }} />
            </Box>
          ))}
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff' }}>
            {activeCategory === 'laptops' ? 'Laptops' : 'Products'}
          </Typography>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', position: 'relative', maxWidth: 400 }}>
          <TextField
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              if (e.target.value.trim()) {
                const suggestions = allProducts.filter(product =>
                  product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                  product.brand.toLowerCase().includes(e.target.value.toLowerCase()) ||
                  product.model.toLowerCase().includes(e.target.value.toLowerCase())
                ).slice(0, 7);
                setSearchSuggestions(suggestions);
              } else {
                setSearchSuggestions([]);
              }
            }}
            onFocus={() => {
              if (searchTerm.trim()) {
                const suggestions = allProducts.filter(product =>
                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.model.toLowerCase().includes(searchTerm.toLowerCase())
                ).slice(0, 7);
                setSearchSuggestions(suggestions);
              }
            }}
            onBlur={() => setTimeout(() => setSearchSuggestions([]), 150)}
            placeholder="Search by name, brand, or model..."
            variant="outlined"
            size="medium"
            sx={{
              width: '100%',
              borderRadius: 3,
              background: '#fff',
              transition: 'box-shadow 0.2s',
              boxShadow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&.Mui-focused': {
                  boxShadow: '0 0 0 2px #2563eb44',
                  borderColor: '#2563eb',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                searchTerm && (
                  <IconButton aria-label="Clear search" onClick={() => { setSearchTerm(''); setSearchSuggestions([]); }} size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )
              ),
              inputProps: {
                'aria-autocomplete': 'list',
                'aria-controls': 'search-suggestion-list',
                'aria-activedescendant': '',
                autoComplete: 'off',
              }
            }}
            autoComplete="off"
            aria-label="Search products"
          />
          {searchSuggestions.length > 0 && (
  <Paper
    id="search-suggestion-list"
    sx={{
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      zIndex: 50, // Higher zIndex to prevent overlap
      mt: 1,
      borderRadius: 3,
      boxShadow: 6,
      maxHeight: 320,
      overflowY: 'auto',
      background: '#fff',
      border: '1px solid #cfd8dc',
      pointerEvents: 'auto',
    }}
    role="listbox"
  >
    {/* Filter duplicates and sort by relevance */}
    {[...new Map(searchSuggestions.map(s => [s.id || s.name, s])).values()]
      .sort((a, b) => {
        // Prioritize exact match, then startsWith, then includes
        const st = searchTerm.toLowerCase();
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName === st && bName !== st) return -1;
        if (bName === st && aName !== st) return 1;
        if (aName.startsWith(st) && !bName.startsWith(st)) return -1;
        if (bName.startsWith(st) && !aName.startsWith(st)) return 1;
        return aName.localeCompare(bName);
      })
      .slice(0, 7)
      .map((suggestion, idx) => {
                const highlight = (text) => {
                  if (!text || typeof text !== 'string' || !searchTerm || typeof searchTerm !== 'string') return text;
                  if (!text || typeof text !== 'string' || !searchTerm || typeof searchTerm !== 'string') return text;
                  const i = text.toLowerCase().indexOf(searchTerm.toLowerCase());
                  if (i === -1) return text;
                  return <>
                    {text.slice(0, i)}
                    <span style={{ background: '#2563eb', color: '#fff', borderRadius: 2, padding: '0 2px' }}>{text.slice(i, i + searchTerm.length)}</span>
                    {text.slice(i + searchTerm.length)}
                  </>;
                };
                const product = allProducts.find(p => p.name === (suggestion.name || suggestion));
                return (
                  <Box
        key={suggestion.id ? `sugg-${suggestion.id}` : `sugg-${idx}`}
        role="option"
        sx={{
          px: 2,
          py: 1.2,
          mb: 0.5,
          cursor: 'pointer',
          background: 'transparent',
          borderRadius: 2,
          transition: 'background 0.2s',
          '&:hover': { background: '#f0f4fa' },
          display: 'flex',
          alignItems: 'center',
          minHeight: 44,
        }}
        onMouseDown={e => {
          e.preventDefault();
          setSearchTerm(suggestion.name || suggestion);
          setSearchSuggestions([]);
        }}
      >
                    <SearchIcon sx={{ fontSize: 20, color: '#2563eb', mr: 1.2 }} />
                    <Box>
                      <Typography
                        variant="body1"
                        component="span"
                        sx={{ fontWeight: 600, color: '#222', fontSize: '1rem', lineHeight: 1.3 }}
                      >
                        {highlight(suggestion.name || suggestion)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ ml: 1, color: '#555', fontSize: '0.95em' }}
                      >
                        {product ? `${product.brand} ${product.model}` : ''}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Paper>
          )}
        </Box>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Condition</InputLabel>
          <Select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            label="Condition"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="used">Used</MenuItem>
          </Select>
        </FormControl>

        {activeCategory === 'laptops' && (
          <>
            {/* Brandwise Category Filter */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Button
                variant={selectedBrand === 'all' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setSelectedBrand('all')}
                sx={{ fontWeight: 600 }}
              >
                All Brands
              </Button>
              {Array.from(new Set(productsByCategory.laptops.map(l => l.brand))).map(brand => (
                <Button
                  key={brand}
                  variant={selectedBrand === brand ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setSelectedBrand(brand)}
                  sx={{ fontWeight: 600 }}
                >
                  {brand}
                </Button>
              ))}
            </Box>
          </>
        )}
        {activeCategory === 'laptops' ? (
          <>
            <Fade in={true} timeout={1500}>
              <Grid container spacing={3}>
                {conditionFilteredProducts
                  .filter(product => selectedBrand === 'all' || product.brand === selectedBrand)
                  .map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <StyledCard sx={{
                        background: '#fff',
                        borderRadius: 3,
                        boxShadow: '0 2px 16px 0 rgba(36,81,171,0.06)',
                        transition: 'box-shadow 0.2s, transform 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 24px 0 #2563eb22',
                          transform: 'translateY(-4px) scale(1.02)',
                          borderColor: '#2563eb44',
                        },
                      }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.image}
                          alt={product.name}
                          sx={{
                            objectFit: 'contain',
                            borderRadius: '8px',
                            background: '#f5f7fa',
                            '&:hover': { opacity: 0.93 }
                          }}
                          onError={(e) => {
                            const img = e.target;
                            img.src = '/images/default-product.jpg';
                          }}
                        />
                        <StyledCardContent>
                          <Typography variant="h6" gutterBottom sx={{ color: '#17436b', fontWeight: 700 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {product.brand} {product.model}
                          </Typography>
                          <Typography variant="h6" color="primary" gutterBottom>
                            {formatPrice(product.price)}
                          </Typography>
                          <Rating value={product.rating} readOnly precision={0.5} />
                          <StyledButtonGroup>
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              sx={{ borderRadius: 2 }}
                              onClick={() => {
                                setSelectedProduct(product);
                                setOpenDetails(true);
                              }}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<ShoppingCartIcon />}
                              sx={{ borderRadius: 2 }}
                              onClick={() => addToCart(product)}
                            >
                              Add to Cart
                            </Button>
                          </StyledButtonGroup>
                        </StyledCardContent>
                      </StyledCard>
                    </Grid>
                  ))}
              </Grid>
            </Fade>
          </>
        ) : (
          <Grid container spacing={3}>
              {conditionFilteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <StyledCard>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        objectFit: 'contain',
                        borderRadius: '8px',
                        '&:hover': {
                          opacity: 0.9
                        }
                      }}
                      onError={(e) => {
                        const img = e.target;
                        img.src = '/images/default-product.jpg';
                      }}
                    />
                    <StyledCardContent>
                      <Typography variant="h6" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {product.brand} {product.model}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {formatPrice(product.price)}
                      </Typography>
                      <Rating value={product.rating} readOnly precision={0.5} />
                      <StyledButtonGroup>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => {
                            setSelectedProduct(product);
                            setOpenDetails(true);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </StyledButtonGroup>
                    </StyledCardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {conditionFilteredProducts.length === 0 && (
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
            No products found matching your criteria
          </Typography>
        )}

        <StyledDialog open={openDetails} onClose={() => setOpenDetails(false)} fullScreen>
          <StyledDialogTitle>
            Product Details
            <IconButton
              onClick={() => setOpenDetails(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </StyledDialogTitle>
          <StyledDialogContent>
            {selectedProduct && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 4 }}>
                  <Box>
                    {/* Product Images Gallery */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 3 }}>
                      {(selectedProduct.images && selectedProduct.images.length > 0
                        ? selectedProduct.images
                        : [selectedProduct.image]
                      ).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${selectedProduct.name} view ${idx + 1}`}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 8,
                            cursor: 'pointer',
                            border: zoomImgIdx === idx ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                            '&:hover': {
                              border: `2px solid ${theme.palette.primary.main}`,
                            },
                          }}
                          onClick={() => setZoomImgIdx(idx)}
                        />
                      ))}
                    </Box>

                    {/* Zoom Modal */}
                    <Dialog
                      open={zoomImgIdx !== null}
                      onClose={() => setZoomImgIdx(null)}
                      maxWidth="md"
                      PaperProps={{
                        sx: {
                          background: 'transparent',
                          boxShadow: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          maxWidth: 'none',
                          maxHeight: 'none',
                          margin: 0,
                          overflow: 'hidden',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100vw',
                          height: '100vh',
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        }}
                      >
                        <IconButton
                          onClick={() => setZoomImgIdx(null)}
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            color: '#fff',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                            zIndex: 2,
                          }}
                        >
                          <CloseIcon />
                        </IconButton>

                        {selectedProduct.images && selectedProduct.images.length > 1 && (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setZoomImgIdx(prev => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);
                            }}
                            sx={{
                              position: 'absolute',
                              left: 16,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#fff',
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                              zIndex: 2,
                            }}
                          >
                            <ArrowBackIosNewIcon />
                          </IconButton>
                        )}

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            padding: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={selectedProduct.images && selectedProduct.images[zoomImgIdx]}
                            alt="Zoomed view"
                            style={{
                              maxWidth: '90%',
                              maxHeight: '90%',
                              objectFit: 'contain',
                              borderRadius: 8,
                              boxShadow: theme.shadows[10],
                            }}
                          />
                        </Box>

                        {selectedProduct.images && selectedProduct.images.length > 1 && (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setZoomImgIdx(prev => (prev + 1) % selectedProduct.images.length);
                            }}
                            sx={{
                              position: 'absolute',
                              right: 16,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#fff',
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                              zIndex: 2,
                            }}
                          >
                            <ArrowForwardIosIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Dialog>

                    <Typography variant="h5" gutterBottom>
                      {selectedProduct.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {selectedProduct.brand} {selectedProduct.model}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
  {selectedProduct.configOptions
    ? formatPrice(
        (selectedProduct.price || 0)
        + (selectedProduct.configOptions.ram && selectedProduct.configOptions.ram.length > 0
            ? (selectedProduct.configOptions.ram.find(opt => opt.value === (configSelections[selectedProduct.id]?.ram || selectedProduct.configOptions.ram[0]?.value))?.price || 0)
            : 0)
        + (selectedProduct.configOptions.storage && selectedProduct.configOptions.storage.length > 0
            ? (selectedProduct.configOptions.storage.find(opt => opt.value === (configSelections[selectedProduct.id]?.storage || selectedProduct.configOptions.storage[0]?.value))?.price || 0)
            : 0)
        + (selectedProduct.configOptions.processor && selectedProduct.configOptions.processor.length > 0
            ? (selectedProduct.configOptions.processor.find(opt => opt.value === (configSelections[selectedProduct.id]?.processor || selectedProduct.configOptions.processor[0]?.value))?.price || 0)
            : 0)
      )
    : formatPrice(selectedProduct.price)
  }
</Typography>
                    <Rating value={selectedProduct.rating} readOnly precision={0.5} />
                    <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                      {selectedProduct.description}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Specifications
                    </Typography>
                    {selectedProduct.configOptions && (
  <>
    {selectedProduct.configOptions.ram && selectedProduct.configOptions.ram.length > 0 && (
      <FormControl fullWidth size="small" sx={{ mt: 1, mb: 1 }}>
        <InputLabel>RAM</InputLabel>
        <Select
          value={(configSelections[selectedProduct.id]?.ram) || selectedProduct.configOptions.ram[0]?.value}
          label="RAM"
          onChange={e => handleConfigChange(selectedProduct.id, 'ram', e.target.value)}
        >
          {selectedProduct.configOptions.ram.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label} {opt.price ? `(+₹${opt.price})` : ''}</MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
    {selectedProduct.configOptions.storage && selectedProduct.configOptions.storage.length > 0 && (
      <FormControl fullWidth size="small" sx={{ mb: 1 }}>
        <InputLabel>Storage</InputLabel>
        <Select
          value={(configSelections[selectedProduct.id]?.storage) || selectedProduct.configOptions.storage[0]?.value}
          label="Storage"
          onChange={e => handleConfigChange(selectedProduct.id, 'storage', e.target.value)}
        >
          {selectedProduct.configOptions.storage.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label} {opt.price ? `(+₹${opt.price})` : ''}</MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
    {selectedProduct.configOptions.processor && selectedProduct.configOptions.processor.length > 0 && (
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Processor</InputLabel>
        <Select
          value={(configSelections[selectedProduct.id]?.processor) || selectedProduct.configOptions.processor[0]?.value}
          label="Processor"
          onChange={e => handleConfigChange(selectedProduct.id, 'processor', e.target.value)}
        >
          {selectedProduct.configOptions.processor.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label} {opt.price ? `(+₹${opt.price})` : ''}</MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  </>
)}
<StyledSpecsList>
  {Object.entries(selectedProduct.specs).map(([key, value]) => (
    <ListItem key={key}>
      <ListItemText
        primary={key.replace(/([A-Z])/g, ' $1').trim()}
        secondary={value}
      />
    </ListItem>
  ))}
</StyledSpecsList>
                  </Box>
                  {/* ... (the images/magnifier column stays as is) ... */}
                </Box>
              </Box>
            )}
          </StyledDialogContent>
          <StyledDialogActions>
            <Button onClick={() => setOpenDetails(false)}>Close</Button>
            <Button
  variant="contained"
  color="primary"
  onClick={() => {
    if (selectedProduct.configOptions) {
      const config = {
        ram: selectedProduct.configOptions.ram && selectedProduct.configOptions.ram.length > 0
          ? (configSelections[selectedProduct.id]?.ram || selectedProduct.configOptions.ram[0]?.value)
          : undefined,
        storage: selectedProduct.configOptions.storage && selectedProduct.configOptions.storage.length > 0
          ? (configSelections[selectedProduct.id]?.storage || selectedProduct.configOptions.storage[0]?.value)
          : undefined,
        processor: selectedProduct.configOptions.processor && selectedProduct.configOptions.processor.length > 0
          ? (configSelections[selectedProduct.id]?.processor || selectedProduct.configOptions.processor[0]?.value)
          : undefined,
      };
      const price =
        (selectedProduct.price || 0)
        + (selectedProduct.configOptions.ram && selectedProduct.configOptions.ram.length > 0
            ? (selectedProduct.configOptions.ram.find(opt => opt.value === config.ram)?.price || 0)
            : 0)
        + (selectedProduct.configOptions.storage && selectedProduct.configOptions.storage.length > 0
            ? (selectedProduct.configOptions.storage.find(opt => opt.value === config.storage)?.price || 0)
            : 0)
        + (selectedProduct.configOptions.processor && selectedProduct.configOptions.processor.length > 0
            ? (selectedProduct.configOptions.processor.find(opt => opt.value === config.processor)?.price || 0)
            : 0);
      addToCart({
        ...selectedProduct,
        selectedConfig: config,
        price,
      });
    } else {
      addToCart(selectedProduct);
    }
    setOpenDetails(false);
  }}
>
  Add to Cart
</Button>
          </StyledDialogActions>
        </StyledDialog>
      </Box>
    );
  };

  export default Products;