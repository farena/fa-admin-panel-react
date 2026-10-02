import { useState } from "react";
import FormWeeklyDate from "~/components/Form/FormWeeklyDate";
import { Example, Section } from "./_PlaygroundLayout";

const ES_DAYS = {
  mon: "Lun",
  tue: "Mar",
  wed: "Mié",
  thu: "Jue",
  fri: "Vie",
  sat: "Sáb",
  sun: "Dom",
};

export default function FormWeeklyDatePlayground() {
  const [weekly, setWeekly] = useState({
    basic: [1, 3, 5],
    spanish: [6, 7],
    disabled: [2, 4],
  });

  return (
    <Section title="FormWeeklyDate" state={weekly}>
      <Example title="Basic (values are ISO weekdays, 1 = Monday)">
        <FormWeeklyDate
          label="Working days"
          description="Select the days the store is open"
          value={weekly.basic}
          onChange={(basic) => setWeekly({ ...weekly, basic })}
        />
      </Example>
      <Example title="Custom lang">
        <FormWeeklyDate
          label="Delivery days"
          lang={ES_DAYS}
          value={weekly.spanish}
          onChange={(spanish) => setWeekly({ ...weekly, spanish })}
        />
      </Example>
      <Example title="Disabled">
        <FormWeeklyDate
          label="Disabled"
          disabled
          value={weekly.disabled}
          onChange={(disabled) => setWeekly({ ...weekly, disabled })}
        />
      </Example>
    </Section>
  );
}
