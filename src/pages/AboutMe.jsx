// DEPENDENCIES AND TOOLS
import React, { useEffect, useState } from 'react'
import axios from 'axios'

//COMPONENTS
import OtherHero from '../components/OtherHero'
import ExperienceComp from '../components/ExperienceComp'
import OneExperience from '../components/OneExperience'
import CallToAction from '../components/CallToAction'
import EducationComp from '../components/EducationComp'
import OneEducation from '../components/OneEducation'
import ContactComp from '../components/ContactComp'
import AlbumComp from '../components/AlbumComp'
import PictureGallery from '../components/PictureGallery'

//EXTRAS
import Spinner from '../components/Spinner'
import verified_image from '../assets/images/verified-2.png'
import p1 from '../assets/images/p1.png'
import p3 from '../assets/images/p3.png'
// import p42 from '../assets/images/p42.png'
import p43 from '../assets/images/p4.webp'
import my_image from '../assets/images/p4-final.webp'
import portrait from '../assets/images/my_portrait.png'

import LongTalk from '../components/LongTalk'
import OneAlbum from '../components/OneAlbum'
import FakeALC from '../components/FakeALC'


const AboutMe = () => {

  const [networkError, setNetworkError] = useState(false)
  const [educations, setEducation] = useState([])
  const [loadingEducation, setLoadingEducation] = useState(false)

  //THE CODE BELOW IS USED TO FETCH EDUCATION

  const fetchEducation = async () => {

    const api = 'https://api.jsonbin.io/v3/b/6735cb9fe41b4d34e4543bb5'
    const apiKey = '$2a$10$30xtUuMAzq12Czec931me.xyVO8.7lHdJT40ZPgsWQP9FtSnPneQC'

    try {
      setLoadingEducation(true)
      const response = await axios.get(api, {
        headers: {
          'X-Master-Key': `${apiKey}`
        }
      })
      const allEducation = response.data.record.education
      setEducation(allEducation)
      setLoadingEducation(false)
    } catch (error) {

      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {

        const response = await axios.get(api)
        const allEducation = response.data.record.education
        setEducation(allEducation)
        setLoadingEducation(false)
      } catch (error) {
        setNetworkError(true)
      }
    }

  }

  useEffect(() => {
    fetchEducation()
  }, [])



  // THE CODE BELOW IS USED TO FETCH EXPERIENCES

  const [experiences, setExperiences] = useState([])
  const [loadingExperience, setLoadingExperiences] = useState(false)

  const fetchExperience = async () => {
    const api = 'https://api.jsonbin.io/v3/b/6735cc87acd3cb34a8a8759c'
    const apiKey = '$2a$10$30xtUuMAzq12Czec931me.xyVO8.7lHdJT40ZPgsWQP9FtSnPneQC'

    try {
      setLoadingExperiences(true)
      const response = await axios.get(api, {
        headers: {
          'X-Master-Key': `${apiKey}`
        }
      })
      const allExperiences = response.data.record.experiences
      setExperiences(allExperiences)
      setLoadingExperiences(false)
    } catch (error) {

      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        setLoadingExperiences(true)
        const response = await axios.get(api)
        const allExperiences = response.data.record.experiences
        setExperiences(allExperiences)
        setLoadingExperiences(false)
      } catch (error) {
        setNetworkError(true)
      }
    }
  }

  useEffect(() => {
    fetchExperience()
  }, [])


  const [albums, setAlbums] = useState([])
  const [loadingAlbums, setLoadingAlbums] = useState(false)
  const [albumError, setAlbumError] = useState(false)

  const fetchAlbums = async () => {
    try {
      setLoadingAlbums(true);

      // Step 1: Get Access Token from Spotify
      const clientId = '3439fb00a69a4381a1c257a5bfc918f2';
      const clientSecret = '082147efedcb4e8e85c4a913add2ec9d';
      const authHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;

      const tokenResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({ grant_type: 'client_credentials' }),
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      console.log('✅ Access token received:', accessToken);

      // Step 2: Define Album IDs (Max 20, no spaces)
      const albumIds = [
        '4jUXymdfBvDcDQQV0gdure',
        '1pUJnA3OSbvVr5afqxNARZ',
        '3KfWAE3Y0JDa7CNo8ovJWu',
        '2O9VJaLSnwjZ2HPpMaVoPU',
        '5jqvO2VFTZ4n5MlE393wwT',
        '0mxle2p72zngkE9p4KAE0A',
        '5xKTTHKTTFyNxtOLGtznaR',
        '2pANu4qucnliJuRR94eZSV',
        '59YYObx9wFEFG5zVdlfwvf',
      ].join(',');

      // Step 3: Fetch Albums from Spotify API
      const albumResponse = await axios.get(
        `https://api.spotify.com/v1/albums?ids=${albumIds}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const allAlbums = albumResponse.data.albums;
      console.log('🎧 Albums fetched:', allAlbums);

      setAlbums(allAlbums);
    } catch (error) {
      console.error('❌ Error fetching your albums');

      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else {
        console.error('Error message:', error.message);
      }

      setAlbumError(true);
    } finally {
      setTimeout(() => {
        setLoadingAlbums(false);
      }, 2000);
    }
  };


  useEffect(() => {
    fetchAlbums()
  }, [])

  useEffect(() => {
    console.log('Updated albums coming from the state', albums);
  }, [])


  return (
    <>
      <OtherHero theText={`Hi, I’m Edun Philips, a 20 year old Frontend Developer from Ibadan, Nigeria. I'm Passionate about creating visually stunning, intuitive, and highly functional web experiences that enhance user interaction and solve real-world problems.`} theSub={'Available for projects'} theImg={portrait} />


      <LongTalk talk1={'Over the years, I’ve honed my skills in creating seamless, pixel-perfect interfaces while keeping performance and accessibility top of mind. I’m constantly exploring new tools and technologies, such as Tailwind CSS and TypeScript, to ensure I’m delivering cutting-edge solutions.'} talk2={'Beyond the code, I thrive on solving complex problems, optimizing workflows, and working closely with designers and developers to build web applications that not only function flawlessly but also deliver an exceptional user experience.'} color={'white'} />



      <EducationComp>

        {
          loadingEducation ? (
            <>
              <Spinner whatsLoading={'Education'} status={`${networkError ? 'Please check your internet connection' : 'Please wait'}`} />
            </>
          ) : (
            <>
              {
                educations.map((education, index) => {
                  return (
                    <OneEducation key={index} education={education} />
                  )
                })
              }
            </>
          )
        }

      </EducationComp>

      <ExperienceComp>
        {
          loadingExperience ? (
            <>
              <Spinner whatsLoading={'Experiences'} status={`${networkError ? 'Please check your internet connection' : 'Please wait'}`} />
            </>
          ) : (
            <>
              {
                experiences.map((experience, index) => {
                  return (
                    <>
                      <OneExperience key={index} experience={experience} />
                    </>
                  )
                })
              }
            </>
          )
        }
      </ExperienceComp>

      <ContactComp id="hire-me" />

      {
        loadingAlbums ? (
          <>
            <FakeALC>
              <Spinner whatsLoading={'Albums'} status={'Please wait'} />
            </FakeALC>
          </>
        ) : albumError ? (
          <>
            <FakeALC>
              <Spinner whatsLoading={'Albums'} status={'Please check your internet connection'} />
            </FakeALC>
          </>
        ) : (
          <>
            <AlbumComp>
              {
                albums.map((album) => {
                  return (
                    <OneAlbum key={album.id} album={album} />
                  )
                })
              }
            </AlbumComp>
          </>
        )
      }

      <PictureGallery />

      <CallToAction />
    </>
  )
}

export default AboutMe