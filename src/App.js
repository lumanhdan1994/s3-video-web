import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Flex, Heading, Skeleton, Spinner, Stack } from "@chakra-ui/react";
import VideoComp from "./components/video";

function App() {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [expireAt, setExpire] = useState(null);

  const getSatmintonVideos = useCallback(async () => {
    try {
      setExpire(null);
      setLoading(true);
      const { data } = await axios.get(
        "https://r47zsc9ef4.execute-api.ap-southeast-2.amazonaws.com/get-s3-video"
      );
      if (!data) {
        throw new Error("Data is undefined");
      }
      const { success, videos, expiredAt } = data;
      console.log("data", data);

      if (!success) {
        throw new Error(`${data.message} - ${data.error}`);
      }
      setExpire(expiredAt);
      setVideos(videos);
    } catch (error) {
      console.error(error);
      setExpire(null);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    let interval;
    getSatmintonVideos().then(() => {
      setInterval(() => {
        setNow(Math.floor(Date.now() / 1000));
      }, 1000);
    });
    return () => clearInterval(interval);
  }, []);

  const expiredIn = useMemo(() => {
    if (loading) {
      return "";
    }

    const secondsLeft = expireAt - now;
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    return secondsLeft > 0
      ? ` - Expired in ${hours.toString().padStart(2, "0")}h ${minutes
          .toString()
          .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
      : " - Expired";
  }, [loading, now]);

  return (
    <Flex bg="brand.500" p="20px" direction="column" gap={4}>
      <Heading>Danh sách Satminton videos{expiredIn}</Heading>
      {loading ? (
        <Flex direction="column" gap={4}>
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} height="80px" borderRadius={"lg"} />
          ))}
        </Flex>
      ) : (
        <>
          {videos.length ? (
            <Flex direction="column" gap={4}>
              {videos.map((video) => (
                <VideoComp key={video.key} video={video} />
              ))}
            </Flex>
          ) : (
            <Flex>There aren't any videos right now.</Flex>
          )}
        </>
      )}
    </Flex>
  );
}

export default App;
