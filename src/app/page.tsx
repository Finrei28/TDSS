import Link from "next/link"
import MaxWidthWapper from "../components/MaxWidthWapper"

export default function Home() {
  return (
    <div className="bg-slate-50">
      <section>
        <MaxWidthWapper className="pb-24 pt-10 lg:grid sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center flex flex-col justify-center items-center">
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-1xl md:text-2xl lg:text-3xl">
                Stuck on a TDS map?
              </h1>
              <p className="relative w-fit tracking-tight text-balance mt-1 !leading-tight text-gray-900 text-sm md:text-base lg:text-lg">
                Browse through TDS strategies to help you win your next game!
              </p>
              <div className="flex flex-col sm:flex-row mt-20 gap-10">
                <Link href="/special">
                  <div className="object-cover transition-transform duration-300 hover:scale-105">
                    <span className="text-orange-400 text-xl">Special</span>
                    <img
                      src="/TDS Special.png"
                      alt="TDS Special mode"
                      className="rounded-sm w-full max-w-xs"
                    />
                  </div>
                </Link>
                <Link href="/normal">
                  <div className="object-cover transition-transform duration-300 hover:scale-105">
                    <span className="text-green-500 text-xl">Normal</span>
                    <img
                      src="/TDS Normal.png"
                      alt="TDS Normal mode"
                      className="rounded-sm w-full max-w-xs"
                    />
                  </div>
                </Link>
                <Link href="/hardcore">
                  <div className="object-cover transition-transform duration-300 hover:scale-105">
                    <span className="text-purple-600 text-xl">Hardcore</span>
                    <img
                      src="/TDS Hardcore.png"
                      alt="TDS Hardcore mode"
                      className="rounded-sm w-full max-w-xs"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </MaxWidthWapper>
      </section>
    </div>
  )
}
