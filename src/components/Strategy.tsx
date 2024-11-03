import React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import MaxWidthWapper from "@/components/MaxWidthWapper"
const strategy = () => {
  return (
    <section>
      <MaxWidthWapper className="mt-16 lg:max-w-screen-lg md:max-w-screen-md">
        <Accordion
          type="multiple"
          defaultValue={["item-1", "item-2", "item-3"]}
          className="w-full"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Player 1:</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Player 2:</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Player 3:</AccordionTrigger>
            <AccordionContent>
              Yes. It&apos;s animated by default, but you can disable it if you
              prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </MaxWidthWapper>
    </section>
  )
}

export default strategy
