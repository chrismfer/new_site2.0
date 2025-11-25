import { useState, useEffect } from 'react';
import { ViewState, TabState, Product } from '../types';

export const useStoreUI = () => {
    // Estado de Inicialização
    const [initializing, setInitializing] = useState(true);

    // Navegação Principal e Tema
    const [viewMode, setViewMode] = useState<'hub' | 'store'>('hub');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    
    // Menu e Barras
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMenuPinned, setIsMenuPinned] = useState(false);
    const [barsVisible, setBarsVisible] = useState(true);

    // Tabs da Loja
    const [activeTab, setActiveTab] = useState<TabState>('loja');
    
    // Modais e Overlays
    const [authView, setAuthView] = useState<ViewState>('loja');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLoginInfo, setShowLoginInfo] = useState(false);
    const [showCreatorProfile, setShowCreatorProfile] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDetailsFromPurchased, setIsDetailsFromPurchased] = useState(false);
    const [galleryState, setGalleryState] = useState<{ isOpen: boolean; images: string[]; currentIndex: number }>({ isOpen: false, images: [], currentIndex: 0 });
    
    // Configurações de Exibição de Produtos
    const [catalogViewMode, setCatalogViewMode] = useState<'sections' | 'grid'>('sections');
    const [categoryLayoutMode, setCategoryLayoutMode] = useState<'carousel' | 'grid'>('carousel');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    // Notificações
    const [notification, setNotification] = useState({ show: false, message: '', type: 'sucesso' as 'sucesso' | 'erro' });

    // --- EFEITOS ---

    // 1. Inicialização de Tema e Menu
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');

        const savedPin = localStorage.getItem('menuPinned') === 'true';
        setIsMenuPinned(savedPin);
        
        // Simula tempo de splash screen
        setInitializing(false);
    }, []);

    // 2. Controle de Scroll para Barras (Header/Nav)
    useEffect(() => {
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setBarsVisible(false);
            } else {
                setBarsVisible(true);
            }
            lastScrollY = currentScrollY;
        };
        
        // Aplica o listener apenas se estiver na loja, pois o Hub não tem scroll no body
        if (viewMode === 'store') {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [viewMode]);

    // --- AÇÕES ---

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const toggleMenuPin = () => {
        const newState = !isMenuPinned;
        setIsMenuPinned(newState);
        localStorage.setItem('menuPinned', String(newState));
    };

    const showNotify = (msg: string, type: 'sucesso' | 'erro') => {
        setNotification({ show: true, message: msg, type });
        setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
    };

    const handleNavigate = (target: 'hub' | 'store', tab?: TabState) => {
        // Resetar estados de UI ao navegar
        setShowAuthModal(false);
        setSelectedProduct(null);
        setGalleryState(prev => ({ ...prev, isOpen: false }));
        setShowLoginInfo(false);
        setShowCreatorProfile(false);
        
        setViewMode(target);
        if (tab) setActiveTab(tab);
        
        // Reset scroll para topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Verifica se algum modal está aberto para ocultar barras de navegação se necessário
    const isAnyModalOpen = !!selectedProduct || showAuthModal || galleryState.isOpen || showLoginInfo || showCreatorProfile;

    return {
        state: {
            initializing,
            viewMode,
            theme,
            menuOpen,
            isMenuPinned,
            barsVisible,
            activeTab,
            authView,
            showAuthModal,
            showLoginInfo,
            showCreatorProfile,
            selectedProduct,
            isDetailsFromPurchased,
            galleryState,
            catalogViewMode,
            categoryLayoutMode,
            sortOrder,
            notification,
            isAnyModalOpen
        },
        actions: {
            setInitializing,
            setViewMode,
            setMenuOpen,
            setActiveTab,
            setAuthView,
            setShowAuthModal,
            setShowLoginInfo,
            setShowCreatorProfile,
            setSelectedProduct,
            setIsDetailsFromPurchased,
            setGalleryState,
            setCatalogViewMode,
            setCategoryLayoutMode,
            setSortOrder,
            toggleTheme,
            toggleMenuPin,
            showNotify,
            handleNavigate
        }
    };
};