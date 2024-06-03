import { ScrollArea } from "@/components/ui/scroll-area"

import './css/Sidebar.css'
import './css/HistoryBlock.css'
import { useContexts } from "@/Contexts";
import { Link, useNavigate } from "react-router-dom";

interface SettingBlockProps {
  image: string;
  name: string;
}

interface SidebarProps {
  isSettings: boolean;
}

interface HistoryBlockProps {
  index: number;
  text: string;
}

function HistoryBlock({index, text}: HistoryBlockProps) {
  return (
    <div className='historyBlock' id={index.toString()}>
      {text}
    </div>
  )
}

function SettingBlock({image, name}: SettingBlockProps) {
  return (
    <div className='settingBlock'>
      <div className='settingBlockIcon'><img src={image}/></div>
      <div className='settingBlockText textTitle'>{name}</div>
    </div>
  )
}

const Sidebar = ({isSettings}: SidebarProps) => {
  const { setSetting } = useContexts();
  const navigate = useNavigate();

  const handleSettingClick = (id: number) => () => {
    setSetting(id);
    navigate("/");
  }
  
  let historyBlock = (<div></div>)
  let blockHeight = '800px'
  const { settings, histories } = useContexts();

  if (isSettings == false) {
    historyBlock = (
      <div className='sectionBorder'>
        <div className='sideBarTitle'>History</div>
        <ScrollArea className="h-[320px] w-[400px] p-4">
          <div>
            {
              histories.map((history) => (
                <HistoryBlock text={history.summary} index={history.id} key={history.id}/>
              ))
            }
          </div>
        </ScrollArea>
      </div>
    )
    blockHeight = '400px'
  }

  return (
    <>
      <div>
        <div className='sideBarTitle'>Setting</div>
        <ScrollArea className={"h-[" + blockHeight + "] w-[400px]"}>
          {
            settings.map((setting) => (
              <div onClick={handleSettingClick(setting.id)} key={"clickdiv-"+setting.name}>
                <SettingBlock name={setting.name} image=""/>
              </div>
            ))
          }
          <Link to={"/settings/0"}>
            <SettingBlock name={"Add new setting"} image=""/>
          </Link>
        </ScrollArea>
      </div>
      {historyBlock}
    </>
  )
}

export default Sidebar;