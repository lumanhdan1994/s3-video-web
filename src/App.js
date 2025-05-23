import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
const EXPIRES_IN_SECONDS = 43200;

const EVENT_TYPES = {
  'en': {
    MS: 'Men Singles',
    WS: 'Women Singles',
    MD: 'Men Doubles',
    WD: 'Women Doubles',
    XD: 'Mixed Doubles',
  },
  'vi': {
    MS: 'Đơn Nam',
    WS: 'Đơn Nữ',
    MD: 'Đôi Nam',
    WD: 'Đôi Nữ',
    XD: 'Đôi Nam Nữ',
  } 
};

function App() {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [expireAt, setExpire] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setExpire(null)
    axios.get('https://r47zsc9ef4.execute-api.ap-southeast-2.amazonaws.com/get-s3-video')
      .then(res => {
        setExpire(Math.floor(Date.now() / 1000) + EXPIRES_IN_SECONDS) // 12 tieng
        setVideos(res.data)
      })
      .catch(err => {
        console.error(err)
        setExpire(null)
      });
  }, []);
  const expiredIn = useMemo(() => {
    if (!expireAt) {
      return ''
    }
    
    const secondsLeft = expireAt - now;
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    return secondsLeft > 0 ? ` - Expired in ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s` : ' - Expired'
  }, [expireAt, now])

  const getVideoTitle = useCallback((video) => {
    const videoKey = video.key.replace(/\.mp4$/i, "");
    const keys = videoKey.split('-');
    const eventType = EVENT_TYPES['vi'][keys[0]] ?? keys[0];
    const playerA = keys[1];
    const playerB = keys[2];
    
    if (!videoKey) return '';
    return `${eventType} - ${playerA} vs ${playerB}`;
  }, [])

  const handleDownload = async (video) => {
    try {
      const response = await fetch(video.url, {
        method: 'GET',
        mode: 'cors',
      });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = video.key; // đặt tên file tải về
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Danh sách Satminton videos{expiredIn}</h1>

      <ul>
        {videos.map(video => (
          <li key={video.key} style={{ marginBottom: 10 }}>
            <span onClick={() => setSelected(video)} style={{ cursor: 'pointer', color: 'blue' }}>
              {getVideoTitle(video)}
            </span>
          </li>
        ))}
      </ul>

      {selected && (
        <div>
          <h2>Đang phát: {selected.key}</h2>
          <video src={selected.url} controls width="640"/>
          <br />
          <a href={selected.url} target='_blank'>
            <button>Tải video</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
