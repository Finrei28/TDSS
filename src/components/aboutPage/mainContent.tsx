import React from "react"

type Image = {
  id: string | number
  url: string
  side: "left" | "right" // Specify whether the image should be on the left or right
}

type AboutContentProps = {
  images: Image[] | undefined
}

const AboutContent = ({ images }: AboutContentProps) => {
  // Filter images for left and right sides
  const leftImages = images?.filter((image) => image.side === "left")
  const rightImages = images?.filter((image) => image.side === "right")

  return (
    <div className="min-h-[calc(100vh-3.5rem)] relative w-full flex justify-center overflow-hidden">
      {/* Central Content */}
      <div className="relative mx-auto md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl p-8 z-10 w-full">
        <h1 className="text-3xl font-bold text-center">About Us</h1>
        <p className="text-lg text-gray-600 mt-10 text-center">
          Tower Defense Simulator is a tower defense game on Roblox and this
          website, Tower Defense Simulator Strategies was created to provide
          players a place to share and learn countless strategies to greatly
          improve their chances of winning a map solo or with a team. TDS
          players will be able to share strategies they know to help other
          players and likewise, they will be able to learn additional strategies
          to futher improve their likeliness of triumphing a map or simply
          improving their triumph time.
        </p>
        <p className="text-lg text-gray-600 mt-4 text-center">
          TDS players will be able to team up in the game lobby and be on the
          same page without hassle by simply sharing the url link of a strategy
          on TDSS. The community will be able to save their favourite strategies
          once they have logged in and will be able to access their favourite
          strategies in their dashboard. Strategy creators may also edit their
          strategies in their dashboard.
        </p>
        <p className="text-lg text-gray-600 mt-4 text-center">
          More on the game can be found through the following link, Tower
          Defense Simulator:
          <a
            href="https://www.roblox.com/games/3260590327/Tower-Defense-Simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-blue-500 break-words"
          >
            https://www.roblox.com/games/3260590327/Tower-Defense-Simulator
          </a>
        </p>
      </div>

      {/* Left Side Images */}
      <div className="hidden md:flex absolute left-5 top-0 h-full flex-col items-center justify-start">
        {leftImages?.map((image, index) => (
          <img
            key={image.id}
            src={image.url}
            alt={`Left Image ${index + 1}`}
            className={`w-40 h-auto transform rotate-[${
              index % 2 === 0 ? "-10deg" : "10deg"
            }] translate-y-[-${20 + index * 5}%] shadow-lg`}
          />
        ))}
      </div>

      {/* Right Side Images */}
      <div className="hidden md:flex absolute right-5 top-0 h-full flex-col items-center justify-start">
        {rightImages?.map((image, index) => (
          <img
            key={image.id}
            src={image.url}
            alt={`Right Image ${index + 1}`}
            className={`w-40 h-auto transform rotate-[${
              index % 2 === 0 ? "10deg" : "-10deg"
            }] translate-y-[${20 + index * 5}%] shadow-lg`}
          />
        ))}
      </div>
    </div>
  )
}

export default AboutContent
