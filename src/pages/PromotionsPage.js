import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Link } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Badge,
  Table,
  Button,
  Tooltip,
} from 'reactstrap'
import NavBar from '../components/NavBar'
import { getPromotionCodes } from '../util/api'

function formatUsages(usageCount, maxAllowedUsageCount) {
  if (!_.isFinite(maxAllowedUsageCount)) {
    return `${usageCount} / Unlimited`
  }

  return `${usageCount} / ${maxAllowedUsageCount}`
}

function formatExpiresAt(expiresAt) {
  if (!expiresAt) {
    return `Never`
  }

  return moment(expiresAt).format('LLL')
}

function formatMoney(cents) {
  const val = (cents / 100).toFixed(2)
  if (_.endsWith(val, '.00')) {
    return `${Math.round(cents / 100)} €`
  }

  return `${val} €`
}


function formatValue(type, value) {
  const label = type === 'FIXED'
      ? `-${formatMoney(value)}`
      : `-${Math.round(value * 100)} %`

  return label
}

class PromotionsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      promotions: [],
      loading: true,
      tooltipOpenForPromotionCode: null,
    }
  }

  _toggleTooltip = (code) => {
    const newVal = code === this.state.tooltipOpenForPromotionCode
      ? null
      : code

    this.setState({
      tooltipOpenForPromotionCode: newVal,
    })
  }

  componentDidMount() {
    getPromotionCodes()
      .then((res) => {
        this.setState({
          promotions: _.reverse(res.data),
          loading: false,
        })
      })
      .catch((err) => {
        this.setState({ loading: false })

        alert('Error fetching promotion codes')
        throw err
      })
  }

  render() {
    return (
      <div className="PromotionsPage">
        <NavBar />

        <Container className="PromotionsPage__content">
          <Row>
            <Col>
              <h1>Promotions</h1>
            </Col>
            <Col className="PromotionsPage__new">
              <Link to="/promotions/create">
                <Button color="success">Create new promotion</Button>
              </Link>
            </Col>
          </Row>

          <Row className="PromotionsPage__table-section">
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>Promotion code</th>
                    <th>Type</th>
                    <th>Discount value</th>
                    <th>Usages</th>
                    <th>Expires at</th>
                    <th>Created at</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    _.map(this.state.promotions, (promotion) =>
                      <tr key={promotion.promotionCode}>
                        <td className="PromotionsPage__promotion-code-row">{promotion.promotionCode}</td>
                        <td className="PromotionsPage__promotion-type-row">
                          <Badge>{promotion.type === 'FIXED' ? '€' : '%'}</Badge>
                        </td>
                        <td>{formatValue(promotion.type, promotion.value)}</td>
                        <td>{formatUsages(promotion.usageCount, promotion.maxAllowedUsageCount)}</td>
                        <td>{formatExpiresAt(promotion.expiresAt)}</td>
                        <td>
                          <span id={`date-tooltip-${promotion.promotionCode}`}>{moment(promotion.createdAt).fromNow()}</span>
                          <Tooltip placement="top" isOpen={this.state.tooltipOpenForPromotionCode === promotion.promotionCode} toggle={() => this._toggleTooltip(promotion.promotionCode)} target={`date-tooltip-${promotion.promotionCode}`}>
                            {moment(promotion.createdAt).format('LLL')}
                          </Tooltip>
                        </td>
                        <td>{promotion.description}</td>
                      </tr>
                    )
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default PromotionsPage;
