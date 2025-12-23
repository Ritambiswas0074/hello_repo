import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import './AnimatedList.css';

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick, horizontal = false }) => {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const inView = useInView(ref, { amount: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={horizontal ? { scale: 0.95, opacity: 0, x: 50 } : { scale: 0.95, opacity: 0, y: 50 }}
      animate={hasAnimated ? { scale: 1, opacity: 1, x: 0, y: 0 } : (horizontal ? { scale: 0.95, opacity: 0, x: 50 } : { scale: 0.95, opacity: 0, y: 50 })}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={horizontal ? { marginRight: 0, cursor: 'pointer', flexShrink: 0 } : { marginBottom: '1rem', cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
    'Item 11',
    'Item 12',
    'Item 13',
    'Item 14',
    'Item 15'
  ],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1,
  renderItem = null,
  horizontal = false
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleItemMouseEnter = useCallback(index => {
    setSelectedIndex(index);
  }, []);

  const handleItemClick = useCallback(
    (item, index) => {
      setSelectedIndex(index);
      if (onItemSelect) {
        onItemSelect(item, index);
      }
    },
    [onItemSelect]
  );

  const handleScroll = useCallback(e => {
    if (horizontal) {
      const { scrollLeft, scrollWidth, clientWidth } = e.target;
      setTopGradientOpacity(Math.min(scrollLeft / 50, 1));
      const rightDistance = scrollWidth - (scrollLeft + clientWidth);
      setBottomGradientOpacity(scrollWidth <= clientWidth ? 0 : Math.min(rightDistance / 50, 1));
    } else {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      setTopGradientOpacity(Math.min(scrollTop / 50, 1));
      const bottomDistance = scrollHeight - (scrollTop + clientHeight);
      setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
    }
  }, [horizontal]);

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = e => {
      if (horizontal) {
        if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
          e.preventDefault();
          setKeyboardNav(true);
          setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        } else if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
          e.preventDefault();
          setKeyboardNav(true);
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          if (selectedIndex >= 0 && selectedIndex < items.length) {
            e.preventDefault();
            if (onItemSelect) {
              onItemSelect(items[selectedIndex], selectedIndex);
            }
          }
        }
      } else {
        if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
          e.preventDefault();
          setKeyboardNav(true);
          setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
          e.preventDefault();
          setKeyboardNav(true);
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          if (selectedIndex >= 0 && selectedIndex < items.length) {
            e.preventDefault();
            if (onItemSelect) {
              onItemSelect(items[selectedIndex], selectedIndex);
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation, horizontal]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      const extraMargin = 50;
      if (horizontal) {
        const containerScrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const itemLeft = selectedItem.offsetLeft;
        const itemRight = itemLeft + selectedItem.offsetWidth;
        if (itemLeft < containerScrollLeft + extraMargin) {
          container.scrollTo({ left: itemLeft - extraMargin, behavior: 'smooth' });
        } else if (itemRight > containerScrollLeft + containerWidth - extraMargin) {
          container.scrollTo({
            left: itemRight - containerWidth + extraMargin,
            behavior: 'smooth'
          });
        }
      } else {
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const itemTop = selectedItem.offsetTop;
        const itemBottom = itemTop + selectedItem.offsetHeight;
        if (itemTop < containerScrollTop + extraMargin) {
          container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
        } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
          container.scrollTo({
            top: itemBottom - containerHeight + extraMargin,
            behavior: 'smooth'
          });
        }
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav, horizontal]);

  return (
    <div className={`scroll-list-container ${horizontal ? 'horizontal' : ''} ${className}`}>
      <div ref={listRef} className={`scroll-list ${horizontal ? 'horizontal' : ''} ${!displayScrollbar ? 'no-scrollbar' : ''}`} onScroll={handleScroll}>
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={index * 0.05}
            index={index}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
            horizontal={horizontal}
          >
            <div className={`item ${selectedIndex === index ? 'selected' : ''} ${itemClassName}`}>
              {renderItem ? renderItem(item, index, selectedIndex === index) : <p className="item-text">{item}</p>}
            </div>
          </AnimatedItem>
        ))}
      </div>
      {false && (
        <>
          <div className={`${horizontal ? 'left-gradient' : 'top-gradient'}`} style={{ opacity: topGradientOpacity }}></div>
          <div className={`${horizontal ? 'right-gradient' : 'bottom-gradient'}`} style={{ opacity: bottomGradientOpacity }}></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;

