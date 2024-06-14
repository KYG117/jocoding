import './css/shadcn.css'
import './css/MainPage.css'
import '../index.css'

import deleteKeyword from '../assets/deleteKeyword.svg'
import exitIcon from '../assets/exitIcon.svg'

import Sidebar from './Sidebar'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ReactNode, useState } from 'react'
import { useContexts } from '@/Contexts'
import TranslateSetting from './api/TranslateSettings'
import { useNavigate } from 'react-router-dom'
// import { LucideTable2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import dictionaryCall from './api/DictionaryCall'

interface DictionaryPopupProps {
  word: string;
  description: string[];
}

interface ParagraphBoxProps {
  children: ReactNode
}

interface KeywordBlockProps {
  children: ReactNode
  index: number
}

interface FormatBlockProps {
  format: string | undefined
}

export type DictionaryItem = {
  word: string;
  description: string[];
}

const DictionaryPopup = ({word, description}: DictionaryPopupProps) => {
    return (
      <div id="dictionaryPopup">
        <div className='rightAlign'>
          <img src={exitIcon}/>
        </div>
        <div className="textTitle">{word}</div>
        {
          description.map((comp, ix) => (<div className="textRegular" key={"description-"+ix.toString()}>{comp}</div>))
        }
      </div>
    )
  }

const CurrentSettingBlock = () => {
  const navigate = useNavigate();
  const { currentSetting, removeKeyword, changeFormat, getPredefinedFormats } = useContexts();

  const KeywordBlock = ({children, index}: KeywordBlockProps) => {
    return (
      <div className='keywordBlock'>
        <span>{children}</span>
        <img src={deleteKeyword} onClick={() => removeKeyword(index)}></img>
      </div>
    )
  }
  
  const FormatBlock = ({format}: FormatBlockProps) => {
    return (
      <Select onValueChange={(value) => changeFormat(value)} defaultValue={format} >
        <SelectTrigger>
          <SelectValue placeholder="Format"/>
        </SelectTrigger>
        <SelectContent>
          {
            getPredefinedFormats().map((entry) => (
              <SelectItem value={entry.formatEN}>{entry.formatKR}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className='currentSettingBlock'>
      <div className='currentSettingIcon'></div>
      <div className='textSubTitle currentSettingSubTitle'>
        <div>필수 키워드</div>
        <div>유형/형식</div>
      </div>
      <div className='currentSettingTagBlock'>
        <div className='currentKeywords'>
        {
          currentSetting()?.keywords.map((keyword, idx) => (
            <KeywordBlock key={"keywordblock-"+keyword} index={idx}>{keyword}</KeywordBlock>
          ))
        }
        </div>
        <div className='currentKeywords textSubTitle'>
            <FormatBlock format={currentSetting()?.format}/>
        </div>
      </div>
      <Button className='currentSettingEditButton' variant="secondary" onClick={() => navigate("/settings/"+currentSetting()?.id.toString())}>편집설정</Button>
    </div>
  )
}

function ParagraphBox({children}: ParagraphBoxProps) {
  return (<div className='paragraphBox'>{children}</div>)
}

function MainPage() {
  const { currentSetting, addHistoryByPage, mainPageText, setMainText } = useContexts();
  const [ isDictionaryVisible, setIsDictionaryVisible ] = useState(false);
  const [ dictionaryItem, setDictionaryItem ] = useState<DictionaryItem>({word: "", description: []});

  const handleClick = async () => {
    const previousPage = mainPageText;
    setMainText({title: "로딩중...", sentences: []});
    if(previousPage.sentences.length !== 0) addHistoryByPage(previousPage);
    const newText = await TranslateSetting(currentSetting());
    setMainText(newText === "" ? {title: "생성 중 오류가 발생했습니다. 다시 시도해 주세요.", sentences: []} : newText);
    if(newText !== "") addHistoryByPage(newText);
  }

  const callDictionary = (word: string) => async () => {
    setDictionaryItem({word: "로딩중...", description: []});
    setIsDictionaryVisible(true);
    const result = await dictionaryCall(word);
    setDictionaryItem(result);
  }

  return (
    <>
      <div className='sidebarView sectionBorder'>
        <Sidebar isSettings={false}/>
      </div>

      <div className='mainView sectionBorder'>
        <div className='sectionBorderOnlyBottom'>
          <CurrentSettingBlock/>
        </div>
        <div>
          <ScrollArea className="h-[777px] w-[783px]">
            <ParagraphBox>
              <span className="highlight">{mainPageText.title}</span><br/>
              {mainPageText.sentences.map((sentence, is) => sentence.map((word, iw) => <span onClick={callDictionary(word)} key={word+is.toString()+"-"+iw.toString()}>{word + ((iw === sentence.length - 1 && is !== mainPageText.sentences.length - 1) ? ". " : " ")}</span>))}
            </ParagraphBox>
          </ScrollArea>
        </div>
      </div>

      <div className='mainSideView sectionBorder'>
        {isDictionaryVisible && <DictionaryPopup word={dictionaryItem.word} description={dictionaryItem.description}/>}

        <div id="evaluationCointainer" className='space-y-5'>
          <div className='space-y-3'>
            <RadioGroup defaultValue="comfortable" >
              <div className='textSubTitle'>글은 만족스러운가요?</div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="up" id="r1" />
                <Label className='textTitle' htmlFor="r1">👍</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="down" id="r2" />
                <Label className='textTitle' htmlFor="r2">👎</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className='space-y-3'>
            <RadioGroup defaultValue="comfortable" >
              <div className='textSubTitle'>글의 내용이 이해되나요?</div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="up" id="r1" />
                <Label className='textTitle' htmlFor="r1">⭕</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="down" id="r2" />
                <Label className='textTitle' htmlFor="r2">❌</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Button variant={'default'} onClick={handleClick}>새로운 글</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainPage
