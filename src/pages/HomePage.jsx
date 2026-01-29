//Dependencies
import React, { useEffect, useState } from 'react'
import axios from 'axios'

//Components
import HomeHero from '../components/HomeHero'
import WorksAndProjects from '../components/WorksAndProjects'
import OneProject from '../components/OneProjects'
import ExperienceComp from '../components/ExperienceComp'
import OneExperience from '../components/OneExperience'
import CallToAction from '../components/CallToAction'
import Spinner from '../components/Spinner'
import FakeWAP from '../components/FakeWAP'
import FlyInDiv from '../components/FlyInDiv'

import { motion } from 'framer-motion'

const HomePage = () => {

  const [internetError, setInternetError] = useState(false)

  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(false)


  const fetchProjects = async () => {

    const api = 'https://api.jsonbin.io/v3/b/6735ce36e41b4d34e4543d34'
    const apiKey = '$2a$10$30xtUuMAzq12Czec931me.xyVO8.7lHdJT40ZPgsWQP9FtSnPneQC'

    const headers = {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey
    }

    try {
      setLoadingProjects(true)
      const response = await axios.get(api, { headers })
      const allProjects = await response.data.record.record
      console.log('These are the projects from the API', allProjects);
      setProjects(allProjects)
      setLoadingProjects(false)
    } catch (error) {

      console.log('Failed to fetched on 1st trial', error);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        setLoadingProjects(true)
        const response = await axios.get(api, { headers })
        const allProjects = await response.data.record.record
        setProjects('Project fetched on second trial', allProjects)
        setLoadingProjects(false)
      } catch (secondError) {
        setConnectionError(true)
      }

    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    console.log('Fetched Projects from the State', projects);

  }, [projects])



  //THE FOLLOWING CODE IS USED TO FETCH EXPERINCES

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
      const allExperiences = response.data.record.record.experiences
      console.log(allExperiences);

      setExperiences(allExperiences)
      setLoadingExperiences(false)
    } catch (error) {

      await new Promise((resolve) => setTimeout(resolve, 2000));

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
        setInternetError(true)
      }
    }
  }

  useEffect(() => {
    fetchExperience()
  }, [])


  return (
    <>
      <FlyInDiv>
        <HomeHero />
      </FlyInDiv>

      {
        loadingProjects ? (
          <>
            <FakeWAP>
              <Spinner whatsLoading={'Projects'} status={'Please wait'} />
            </FakeWAP>
          </>
        ) : internetError ? (
          <>
            <FakeWAP>
              <Spinner whatsLoading={'Projects'} status={'Please check your internet connection'} />
            </FakeWAP>
          </>
        ) : (
          <>
            <WorksAndProjects>
              {
                projects && Array.isArray(projects) ? (
                  projects.slice(0, 6).map((project, index) => {
                    return (
                      <OneProject project={project} key={index} />
                    )
                  })
                ) : (
                  <>
                    <p className='text-center'>Unable to fetch projects</p>
                  </>
                )
              }
            </WorksAndProjects>
          </>
        )
      }


      <ExperienceComp>
        {
          loadingExperience ? (
            <>
              <Spinner whatsLoading={'Experiences'} status={`${internetError ? 'Please check your internet connection' : 'Please wait'}`} />
            </>
          ) : (
            <>
              {
                experiences && Array.isArray(experiences) ? (
                  experiences.map((experience, index) => {
                    return (
                      <>
                        <OneExperience key={index} experience={experience} />
                      </>
                    )
                  })
                ) : (
                  <>
                    <p>Unable to fetch experiences</p>
                  </>
                )
              }
            </>
          )
        }
      </ExperienceComp>


      <CallToAction />


    </>
  )
}

export default HomePage