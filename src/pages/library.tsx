import { Row } from 'src/components/list/row';
import { Pill } from 'src/components/pills/Pill';
import { LinkOut } from 'src/components/text/LinkOut';
import { ValidatorGroupRow } from 'src/features/validators/components/ValidatorGroupRow';

const page = () => {
  return (
    <div className="w-96">
      Pill <Pill>Test</Pill>
      <br />
      External Link <LinkOut href="https://thecelo.com">Link Out</LinkOut>
      <Row name="Example Row" href="https://thecelo.com">
        Item
      </Row>
      <Row name="Happy Validating" href="https://thecelo.com" highlighted={true}>
        &hellip;197F6
      </Row>
      <Row name="#81 Autocrat for life" href="https://thecelo.com">
        <Pill>Passed</Pill>
      </Row>
      <Row
        href="https://thecelo.com"
        name="LONG NAMEsl;fjsak;fjj djhfha02nvb28la jdhduyabfosw dd ddd"
      >
        Child Here
      </Row>
      <ValidatorGroupRow
        name="PolyCentric"
        groupAddress="0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1"
      />
      <ValidatorGroupRow name="" groupAddress="0x43d72Ff17701B2DA814620735C39C620Ce0ea4A1" />
    </div>
  );
};
export default page;
