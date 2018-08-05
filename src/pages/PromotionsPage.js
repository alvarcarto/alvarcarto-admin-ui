import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Table,
  Button,
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

  return expiresAt
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
    }
  }

  componentDidMount() {
    getPromotionCodes()
      .then((res) => {
        this.setState({
          promotions: res.data,
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
                        <td>{promotion.promotionCode}</td>
                        <td>{formatValue(promotion.type, promotion.value)}</td>
                        <td>{formatUsages(promotion.usageCount, promotion.maxAllowedUsageCount)}</td>
                        <td>{formatExpiresAt(promotion.expiresAt)}</td>
                        <td>{promotion.createdAt}</td>
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
