import { CSSProperties, useRef } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import useMediaQuery from '@app/hooks/useMediaQuery'
import { theme } from '@app/styles/theme'
import DefaultButton from '@app/components/ui/buttons/DefaultButton'
import { formDataHttp } from '@app/lib/helpers/formData'
import { ConsultationFormTypeEnum } from '@app/lib/api/gen/api'
import Link from 'next/link'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import Checkbox from '@app/components/ui/inputs/Checkbox'
import { ReactNode } from 'react'
import PuzzleGirls from 'public/images/png/childrenCampForm/leftImage.png'
import EffafaBoys from 'public/images/png/childrenCampForm/rightImage.png'
import CountrySelectorInput from '@app/components/ui/inputs/CountrySelectorInput'
import { useTranslation } from 'next-i18next'
import useIsClient from '@app/hooks/useIsClient'
import { GetValidationSchemaWithoutVideo } from '@app/lib/consts/validationSchema'
interface IWhoCheckbox {
  label: string
  value: ConsultationFormTypeEnum
}

interface IChildren {
  children: ReactNode
}

const CampForm = ({ children }: IChildren) => {
  const xl = useMediaQuery('xl')
  const validationSchema = GetValidationSchemaWithoutVideo()
  const { t } = useTranslation('forms')
  const { t: tButton } = useTranslation('buttons')
  const { t: tValidation } = useTranslation('validationForm')
  const formik = useFormik({
    initialValues: {
      type: 'parent',
      full_name: '',
      phone_number: '',
      email: '',
      video: null,
      message: '',
    },
    onSubmit: async (values) => {
      await toast.promise(formDataHttp(values, '/camps/camp-forms/', 'POST'), {
        pending: 'Загрузка...',
        success: 'Успех!',
        error: 'Ошибочка...',
      })
      formik.resetForm()
    },
    validationSchema,
  })
  const { full_name, phone_number, email, message } = formik.values
  const { current: whoCheckboxes } = useRef<IWhoCheckbox[]>([
    {
      label: t('parent'),
      value: 'parent',
    },
    {
      label: t('child'),
      value: 'children',
    },
  ])

  const isClient = useIsClient()

  if (!isClient) return <></>

  return (
    <Section>
      <Container>
        {!xl && xl != undefined && (
          <LeftImage>
            <Image src={PuzzleGirls} alt="boy" width={570} height={1000} />
          </LeftImage>
        )}
        <Form onSubmit={formik.handleSubmit}>
          <Title>{children}</Title>
          <FormContent>
            <CheckBoxes>
              {whoCheckboxes.map(({ label, value }) => (
                <Checkbox
                  value={value}
                  onChange={(e) => formik.setFieldValue('type', e.target.value)}
                  label={label}
                  checked={formik.values.type === value}
                  styles={{
                    text: {
                      fontWeight: 400,
                      fontSize: 16,
                    },
                  }}
                  key={value}
                />
              ))}
            </CheckBoxes>
            <Input onChange={formik.handleChange} value={full_name} name="full_name" placeholder={t('name')} />
            <CountrySelectorInput formik={formik} phone_number={phone_number} />
            <Input onChange={formik.handleChange} value={email} name="email" placeholder={t('email')} />
            <Textarea onChange={formik.handleChange} value={message} name="message" placeholder={t('messageText')} />

            {!!Object.values(formik.errors).length && formik.touched.full_name && (
              <ErrorText>{tValidation('fillFieldsCorrectly')}</ErrorText>
            )}
            <BtnWrapper>
              <DefaultButton type="submit">{tButton('send')}</DefaultButton>
            </BtnWrapper>

            <Consent>
              {t('privacyPolicy')}
              <Link href="/">{t('privacyPolicyButton')}</Link>
            </Consent>
          </FormContent>
        </Form>
        {!xl && xl != undefined && (
          <RightImage>
            <Image src={EffafaBoys} alt="girl" width={570} height={1000} />
          </RightImage>
        )}
      </Container>
    </Section>
  )
}

const { colors, mqMax } = theme
const Section = styled.section`
  padding-bottom: 90px;
  margin-top: 80px;

  ${mqMax('sm')} {
    padding-bottom: 40px;
  }
`
const Container = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
`
const LeftImage = styled.div`
  img {
    max-width: 100%;
    border-radius: 500px;
    overflow: hidden;
    object-fit: cover;
  }
`
const Form = styled.form`
  background: ${colors.white};
  border-radius: 500px;
  padding: 79px 152px;
  ${mqMax('xl')} {
    flex: 1;
  }
  ${mqMax('md')} {
    padding: 59px 34px;
  }

  ${mqMax('md')} {
    padding: 59px 0;
    border-radius: 200px;
  }
`
const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 54px;
  line-height: 62px;
  text-align: center;
  color: ${colors.gray_900};
  margin-bottom: 20px;

  span {
    display: block;
  }

  ${mqMax('md')} {
    font-size: 24px;
    line-height: 26px;
  }
`
const FormContent = styled.div`
  padding: 0 31.5px;
`
const CheckBoxes = styled.div`
  display: flex;
  justify-content: space-around;

  margin-bottom: 15px;

  ${mqMax('md')} {
    justify-content: space-around;
    row-gap: 15px;
  }
`
const Input = styled.input<{ customStyle?: CSSProperties }>`
  display: block;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;
  color: ${colors.gray_200};
  border-bottom: 1px solid ${colors.gray_200};
  padding: 13px 0;
  width: 100%;
  ${(p) => p.customStyle as never}
  margin-bottom: 10px;

  ${mqMax('md')} {
    font-size: 14px;
    margin-bottom: 20px;
  }

  &:focus-within {
    border-bottom: 1px solid ${colors.primary};
    outline: none;
  }
`

const Textarea = styled.textarea`
  display: block;
  width: 100%;
  height: 176px;
  border: 1px solid ${colors.gray_200};
  margin: 15px 0 20px;
  padding: 12px 16px;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;
  color: ${colors.gray_200};

  &:focus-within {
    border: 1px solid ${colors.primary};
    outline: none;
  }
`
const ErrorText = styled.h6`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`
const BtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
`
const Consent = styled.p`
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  text-align: center;
  color: ${colors.gray_900};

  a {
    color: ${colors.primary};
    display: block;
  }

  ${mqMax('sm')} {
    font-size: 11px;
  }
`

const RightImage = styled(LeftImage)``

export default CampForm
