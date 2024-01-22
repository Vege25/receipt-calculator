import React from 'react';
import { createWorker } from 'tesseract.js';

function App() {
  const [textAreaText, setTextAreaText] = React.useState<string>('');
  const [numbers, setNumbers] = React.useState<string[]>([]);
  const [priceNumbers, setPriceNumbers] = React.useState<string[]>([]);
  const [totalPrice, setTotalPrice] = React.useState<string>('');
  const [isTotalCorerct, setIsTotalCorrect] = React.useState<boolean>(true);

  const fileSelectorRef = React.useRef<HTMLInputElement>(null);
  const img = React.useRef<HTMLImageElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null); // Added textareaRef

  React.useEffect(() => {
    console.log('Numbers:', numbers);
  }, [numbers]);

  React.useEffect(() => {
    console.log('Price Numbers:', priceNumbers);
  }, [priceNumbers]);

  const handleFileChange = () => {
    const file = fileSelectorRef.current?.files?.[0];
    if (!file) return;
    const imgUrl = window.URL.createObjectURL(
      new Blob([file], { type: 'image/png' })
    );
    img.current!.src = imgUrl;
  };

  const handleImageScanning = async () => {
    setTextAreaText('Loading...');
    const worker = await createWorker('eng');
    try {
      const { data } = await worker.recognize(
        fileSelectorRef.current?.files?.[0] as File
      );
      const text = data?.text || '';
      setTextAreaText(text);
      getNumbers(text);
    } finally {
      await worker.terminate();
    }
  };
  const getNumbers = (text: string) => {
    const regexToRemove = /\b\d{1,3}(?:,\d{2,3})?\s*€\/KPL\b/g;
    text = text.replace(regexToRemove, '');

    console.log('remainder', text);

    const regex2 = /\b\d{1,3}(?:,\d{2,3})*(?:\.\d{1,2})?\b/g;
    const matches = text.match(regex2);

    if (matches) {
      setNumbers(matches);
      getPriceNumbers();
      getTotalPrice(text);
    } else {
      setNumbers([]);
      getPriceNumbers();
      getTotalPrice(text);
    }
  };
  const getPriceNumbers = () => {
    setPriceNumbers(numbers.filter((number) => number.includes(',')));
  };

  const getTotalPrice = (text: string) => {
    const regex3 = /EENSA\s+(\d{1,3}(?:,\d{2,3})?(?:\.\d{1,2})?)/g;
    const matches = text.match(regex3);

    if (matches) {
      const totalPriceMatch = matches[0].match(
        /\d{1,3}(?:,\d{2,3})?(?:\.\d{1,2})?/
      );
      if (totalPriceMatch) {
        setTotalPrice(totalPriceMatch[0]);
        calculateTotalPrice();
      } else {
        setTotalPrice('0'); // Default value if matching fails
      }
    }
  };
  const calculateTotalPrice = () => {
    let total = 0;
    console.log('pricenumberlenght', priceNumbers.length);
    priceNumbers.forEach((number) => {
      console.log(parseFloat(number.replace(',', '.')));
      total += parseFloat(number.replace(',', '.'));
    });
    console.log('total:', total); // Add this line to log total

    if (total === parseFloat(totalPrice)) {
      setIsTotalCorrect(true);
    } else {
      setIsTotalCorrect(false);
    }
  };

  return (
    <div className='container'>
      <div className='top'>
        <input type='file' ref={fileSelectorRef} onChange={handleFileChange} />
        <button onClick={handleImageScanning}>Start</button>
        <div className='progress'></div>
      </div>
      <div className='bottom'>
        <div>
          <img ref={img} src='' alt='Ref image' />
        </div>
        <div>
          <textarea
            ref={textareaRef} // Changed from ref='textarea'
            name='scannedText'
            id='scannedText'
            placeholder='text will appear here'
            value={textAreaText} // added value prop
          ></textarea>
        </div>
        <div className={isTotalCorerct ? 'box' : 'box-wrong'}></div>
        <h1>TOTAL PRICE: {totalPrice}</h1>
        <div>
          <h2>Receipt prices:</h2>
          <ul>
            {priceNumbers?.map((number, index) => (
              <li key={index}>
                <p>Price: {number}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
